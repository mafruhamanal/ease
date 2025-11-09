"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _url = require("url");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = process.env.PORT || 3001;
app.use((0, _cors["default"])());
app.use(_express["default"].json()); // Your MCP Agent ID from environment variable

var AGENT_ID = process.env.MCP_AGENT_ID;

if (!AGENT_ID) {
  console.error("❌ MCP_AGENT_ID environment variable is required");
  process.exit(1);
} // Health check endpoint


app.get("/health", function (req, res) {
  res.json({
    status: "ok",
    agentConfigured: !!AGENT_ID
  });
}); // Proxy endpoint for MCP agent calls

app.post("/api/mcp", function _callee(req, res) {
  var _req$body, tool, toolArgs, response, error, data;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, tool = _req$body.tool, toolArgs = _req$body.arguments;

          if (tool) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Tool name is required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01",
              "anthropic-agent-id": AGENT_ID
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1024,
              tools: [{
                type: "mcp",
                mcp_server: "elevenlabs"
              }],
              messages: [{
                role: "user",
                content: "Use the ".concat(tool, " tool with these arguments: ").concat(JSON.stringify(toolArgs))
              }]
            })
          }));

        case 6:
          response = _context.sent;

          if (response.ok) {
            _context.next = 12;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(response.text());

        case 10:
          error = _context.sent;
          throw new Error("API error: ".concat(response.status, " - ").concat(error));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(response.json());

        case 14:
          data = _context.sent;
          res.json(data);
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("Error calling MCP agent:", _context.t0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
}); // Text-to-speech endpoint

app.post("/api/tts", function _callee2(req, res) {
  var _req$body2, text, voiceId, modelId, response, error, data;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, text = _req$body2.text, voiceId = _req$body2.voiceId, modelId = _req$body2.modelId;

          if (text) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Text is required"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01",
              "anthropic-agent-id": AGENT_ID
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1024,
              tools: [{
                type: "mcp",
                mcp_server: "elevenlabs"
              }],
              messages: [{
                role: "user",
                content: "Generate speech from this text: \"".concat(text, "\"").concat(voiceId ? " using voice ID ".concat(voiceId) : "").concat(modelId ? " with model ".concat(modelId) : "")
              }]
            })
          }));

        case 6:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 12;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(response.text());

        case 10:
          error = _context2.sent;
          throw new Error("API error: ".concat(response.status, " - ").concat(error));

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(response.json());

        case 14:
          data = _context2.sent;
          res.json(data);
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error("Error generating speech:", _context2.t0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
}); // List voices endpoint

app.get("/api/voices", function _callee3(req, res) {
  var response, error, data;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01",
              "anthropic-agent-id": AGENT_ID
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1024,
              tools: [{
                type: "mcp",
                mcp_server: "elevenlabs"
              }],
              messages: [{
                role: "user",
                content: "List all available voices from ElevenLabs"
              }]
            })
          }));

        case 3:
          response = _context3.sent;

          if (response.ok) {
            _context3.next = 9;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(response.text());

        case 7:
          error = _context3.sent;
          throw new Error("API error: ".concat(response.status, " - ").concat(error));

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(response.json());

        case 11:
          data = _context3.sent;
          res.json(data);
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.error("Error fetching voices:", _context3.t0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
}); // Start server

app.listen(PORT, function () {
  console.log("\uD83D\uDE80 MCP Proxy server running on http://localhost:".concat(PORT));
  console.log("\u2705 Using MCP Agent ID: ".concat(AGENT_ID.substring(0, 8), "..."));
}); // Graceful shutdown

process.on("SIGINT", function () {
  console.log("\nShutting down...");
  process.exit(0);
});