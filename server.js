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

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY in environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Local proxy is running." });
});

app.post("/api/prefill", async (req, res) => {
  try {
    const { systemPrompt, userPrompt } = req.body || {};

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({
        ok: false,
        error: "Missing systemPrompt or userPrompt."
      });
    }

    const upstreamResponse = await fetch(`${baseURL}/chat/completions`, {
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

    return res.status(500).json({
      ok: false,
      error: "Server request failed."
    });
  }
});

app.listen(port, () => {
  console.log(`Local proxy running on http://localhost:${port}`);
});
