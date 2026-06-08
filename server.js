import crypto from "crypto";
import { execFile } from "child_process";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

dotenv.config();

const execFileAsync = promisify(execFile);
const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;
const model = process.env.OPENAI_MODEL || "deepseek-reasoner";
const appOrigin = process.env.APP_ORIGIN?.replace(/\/+$/, "") || "";
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 20);
const deployRepo = process.env.DEPLOY_REPO?.trim() || "";
const deployBranch = process.env.DEPLOY_BRANCH?.trim() || "main";
const deployWebhookSecret = process.env.DEPLOY_WEBHOOK_SECRET?.trim() || "";
const deployRestart = !["0", "false", "no", "off"].includes(String(process.env.DEPLOY_RESTART || "1").trim().toLowerCase());
const deployInstallOnPackageChange = !["0", "false", "no", "off"].includes(
  String(process.env.DEPLOY_INSTALL_ON_PACKAGE_CHANGE || "1").trim().toLowerCase()
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const normalizedBaseURL = baseURL ? baseURL.replace(/\/+$/, "") : "";
const rateLimitBuckets = new Map();
const packageManifestFiles = new Set(["package.json", "package-lock.json"]);

function getMissingConfig() {
  const missing = [];

  if (!apiKey) {
    missing.push("OPENAI_API_KEY");
  }

  if (!normalizedBaseURL) {
    missing.push("OPENAI_BASE_URL");
  }

  return missing;
}

function getDeployConfigSummary() {
  return {
    deployWebhookConfigured: Boolean(deployWebhookSecret),
    deployRepo,
    deployBranch
  };
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "unknown";
}

function getGitHubSignature(req) {
  const rawSignature = req.headers["x-hub-signature-256"];

  if (typeof rawSignature !== "string" || !rawSignature.startsWith("sha256=")) {
    return "";
  }

  return rawSignature.slice("sha256=".length).trim();
}

function verifyGitHubSignature(rawBody, signature) {
  if (!deployWebhookSecret || !signature) {
    return false;
  }

  const expected = crypto.createHmac("sha256", deployWebhookSecret).update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

function collectChangedPaths(payload) {
  const changedPaths = new Set();

  if (!Array.isArray(payload?.commits)) {
    return changedPaths;
  }

  for (const commit of payload.commits) {
    for (const key of ["added", "modified", "removed"]) {
      const paths = Array.isArray(commit?.[key]) ? commit[key] : [];

      for (const filePath of paths) {
        if (typeof filePath === "string" && filePath.trim()) {
          changedPaths.add(filePath.trim());
        }
      }
    }
  }

  return changedPaths;
}

function hasPackageManifestChanges(changedPaths) {
  for (const filePath of changedPaths) {
    if (packageManifestFiles.has(filePath)) {
      return true;
    }
  }

  return false;
}

async function runCommand(command, args, timeoutMs) {
  try {
    const { stdout = "", stderr = "" } = await execFileAsync(command, args, {
      cwd: __dirname,
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024
    });

    return {
      ok: true,
      output: [stdout.trim(), stderr.trim()].filter(Boolean).join("\n").trim()
    };
  } catch (error) {
    const stdout = typeof error?.stdout === "string" ? error.stdout.trim() : "";
    const stderr = typeof error?.stderr === "string" ? error.stderr.trim() : "";
    const message = error instanceof Error ? error.message.trim() : "";

    return {
      ok: false,
      output: [stdout, stderr, message].filter(Boolean).join("\n").trim()
    };
  }
}

function scheduleProcessRestart() {
  const timer = setTimeout(() => {
    process.exit(0);
  }, 1000);

  timer.unref();
}

function rateLimitAiProxy(req, res, next) {
  if (!Number.isFinite(rateLimitWindowMs) || !Number.isFinite(rateLimitMax) || rateLimitMax <= 0) {
    return next();
  }

  const now = Date.now();
  const ip = getClientIp(req);
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(ip, {
      count: 1,
      resetAt: now + rateLimitWindowMs
    });
    return next();
  }

  bucket.count += 1;

  if (bucket.count > rateLimitMax) {
    return res.status(429).json({
      ok: false,
      error: "Too many AI requests. Please try again later."
    });
  }

  return next();
}

if (appOrigin) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", appOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    return next();
  });
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "same-origin");
  next();
});

app.post("/api/deploy-webhook", express.raw({ type: "*/*", limit: "1mb" }), async (req, res) => {
  if (!deployWebhookSecret) {
    return res.status(503).json({
      ok: false,
      error: "deploy-webhook-not-configured"
    });
  }

  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
  const signature = getGitHubSignature(req);

  if (!verifyGitHubSignature(rawBody, signature)) {
    return res.status(403).json({
      ok: false,
      error: "invalid-signature"
    });
  }

  let payload;

  try {
    payload = JSON.parse(rawBody.toString("utf8") || "{}");
  } catch {
    return res.status(400).json({
      ok: false,
      error: "invalid-json"
    });
  }

  const event = String(req.headers["x-github-event"] || "").trim();
  const delivery = String(req.headers["x-github-delivery"] || "").trim();

  if (event === "ping") {
    return res.json({
      ok: true,
      event: "ping",
      delivery,
      zen: String(payload?.zen || "").trim()
    });
  }

  if (event !== "push") {
    return res.json({
      ok: true,
      ignored: true,
      reason: `unsupported-event:${event || "unknown"}`
    });
  }

  const repository = String(payload?.repository?.full_name || "").trim();
  const expectedRef = `refs/heads/${deployBranch}`;
  const receivedRef = String(payload?.ref || "").trim();

  if (deployRepo && repository !== deployRepo) {
    return res.json({
      ok: true,
      ignored: true,
      reason: "repository-mismatch",
      expectedRepo: deployRepo,
      receivedRepo: repository
    });
  }

  if (receivedRef !== expectedRef) {
    return res.json({
      ok: true,
      ignored: true,
      reason: "branch-mismatch",
      expectedRef,
      receivedRef
    });
  }

  const changedPaths = collectChangedPaths(payload);
  const gitPullResult = await runCommand("git", ["pull", "--ff-only", "origin", deployBranch], 60_000);

  if (!gitPullResult.ok) {
    return res.status(500).json({
      ok: false,
      error: "git-pull-failed",
      delivery,
      output: gitPullResult.output || "git-pull-failed"
    });
  }

  const alreadyUpToDate = gitPullResult.output.includes("Already up to date.");
  const packageInstallRan =
    !alreadyUpToDate &&
    deployInstallOnPackageChange &&
    hasPackageManifestChanges(changedPaths);

  let npmInstallOutput = "";

  if (packageInstallRan) {
    const npmInstallResult = await runCommand("npm", ["ci", "--omit=dev"], 300_000);

    if (!npmInstallResult.ok) {
      return res.status(500).json({
        ok: false,
        error: "npm-ci-failed",
        delivery,
        gitOutput: gitPullResult.output || "git-pull-ok",
        npmOutput: npmInstallResult.output || "npm-ci-failed"
      });
    }

    npmInstallOutput = npmInstallResult.output;
  }

  const restartScheduled = !alreadyUpToDate && deployRestart;

  if (restartScheduled) {
    scheduleProcessRestart();
  }

  return res.json({
    ok: true,
    event,
    delivery,
    repository,
    ref: receivedRef,
    restartScheduled,
    packageInstallRan,
    gitOutput: gitPullResult.output || "git-pull-ok",
    npmOutput: npmInstallOutput || ""
  });
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

app.get("/api/health", (req, res) => {
  const missingConfig = getMissingConfig();

  res.json({
    ok: missingConfig.length === 0,
    message: "Local proxy is running.",
    aiProxyConfigured: missingConfig.length === 0,
    missingConfig,
    ...getDeployConfigSummary()
  });
});

app.post("/api/prefill", rateLimitAiProxy, async (req, res) => {
  try {
    const { systemPrompt, userPrompt } = req.body || {};
    const missingConfig = getMissingConfig();

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({
        ok: false,
        error: "Missing systemPrompt or userPrompt."
      });
    }

    if (missingConfig.length > 0) {
      return res.status(503).json({
        ok: false,
        error: `Server is missing required environment variables: ${missingConfig.join(", ")}.`
      });
    }

    const upstreamResponse = await fetch(`${normalizedBaseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        stream: false
      })
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      throw new Error(`Upstream request failed with ${upstreamResponse.status}: ${errorText || "<empty body>"}`);
    }

    const response = await upstreamResponse.json();
    const rawText = response.choices?.[0]?.message?.content ?? "";

    console.log("AI rawText preview:", String(rawText).slice(0, 2000));

    return res.json({
      ok: true,
      rawText
    });
  } catch (error) {
    console.error("Upstream proxy error:", error);

    return res.status(502).json({
      ok: false,
      error: error instanceof Error ? error.message : "Server request failed."
    });
  }
});

app.listen(port, () => {
  console.log(`Local proxy running on http://localhost:${port}`);
  const missingConfig = getMissingConfig();

  if (missingConfig.length > 0) {
    console.warn(`AI proxy is not fully configured. Missing: ${missingConfig.join(", ")}`);
  }
});
