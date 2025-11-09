import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const AGENT_ID = process.env.MCP_AGENT_ID;

if (!AGENT_ID) {
  console.error("MCP_AGENT_ID environment variable is required");
  process.exit(1);
}

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    agentConfigured: !!AGENT_ID,
  });
});

app.post("/api/mcp", async (req, res) => {
  try {
    const { tool, arguments: toolArgs } = req.body;

    if (!tool) {
      return res.status(400).json({ error: "Tool name is required" });
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
            content: `Use the ${tool} tool with these arguments: ${JSON.stringify(
              toolArgs
            )}`,
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
    console.error("Error calling MCP agent:", error);
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
  console.log(`🚀 MCP Proxy server running on http://localhost:${PORT}`);
  console.log(`✅ Using MCP Agent ID: ${AGENT_ID.substring(0, 8)}...`);
});
=
process.on("SIGINT", () => {
  console.log("\nShutting down...");
  process.exit(0);
});
