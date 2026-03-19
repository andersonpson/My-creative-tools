import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;
const model = process.env.OPENAI_MODEL || "deepseek-reasoner";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const normalizedBaseURL = baseURL ? baseURL.replace(/\/+$/, "") : "";

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

app.use(cors());
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
    missingConfig
  });
});

app.post("/api/prefill", async (req, res) => {
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
