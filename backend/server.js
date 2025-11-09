import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const AGENT_ID = process.env.MCP_AGENT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!AGENT_ID) {
  console.error("MCP_AGENT_ID environment variable is required");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is required");
  process.exit(1);
}
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    agentConfigured: !!AGENT_ID,
    geminiConfigured: !!GEMINI_API_KEY,
  });
});
app.post("/api/generate-report", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      content: text,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/mcp", async (req, res) => {
  try {
    const { tool, arguments: toolArgs } = req.body;

    if (!tool) {
      return res.status(400).json({ error: "Tool name is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `You are an assistant that uses tools to complete tasks. 
      
Use the ${tool} tool with these arguments: ${JSON.stringify(toolArgs)}

Please execute this tool call and return the result in a structured format.`,
    });

    const result = response.text;

    res.json({
      content: result,
      tool_used: tool,
      arguments: toolArgs,
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Text-to-speech endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceId, modelId } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-agent-id": AGENT_ID,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        tools: [
          {
            type: "mcp",
            mcp_server: "elevenlabs",
          },
        ],
        messages: [
          {
            role: "user",
            content: `Generate speech from this text: "${text}"${
              voiceId ? ` using voice ID ${voiceId}` : ""
            }${modelId ? ` with model ${modelId}` : ""}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).json({ error: error.message });
  }
});

// list voices endpoint
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-agent-id": AGENT_ID,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        tools: [
          {
            type: "mcp",
            mcp_server: "elevenlabs",
          },
        ],
        messages: [
          {
            role: "user",
            content: "List all available voices from ElevenLabs",
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching voices:", error);
    res.status(500).json({ error: error.message });
  }
});

// start server
app.listen(PORT, () => {
  console.log(` MCP Proxy server running on http://localhost:${PORT}`);
  console.log(` Using MCP Agent ID: ${AGENT_ID.substring(0, 8)}...`);
  console.log(`Gemini API configured`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down...");
  process.exit(0);
});
