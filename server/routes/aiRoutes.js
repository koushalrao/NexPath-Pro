const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const verifyToken = require("../middleware/verifyToken");

// POST /api/ai/chat (protected)
router.post("/chat", verifyToken, async (req, res) => {
  try {
    const { messages } = req.body; // array of { role, content }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        message: "AI service not configured. Add ANTHROPIC_API_KEY to server .env to enable this feature.",
      });
    }

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system:
          "You are NexPath AI, a career advisor for computer science students in India. " +
          "Help with internship searches, resume reviews, interview prep, career roadmaps, " +
          "and skill development advice. Be concise, practical, and encouraging.",
        messages,
      },
      {
        headers: {
          "x-api-key":         process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type":      "application/json",
        },
      }
    );

    const reply = response.data.content[0].text;
    res.json({ reply });
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI request failed" });
  }
});

module.exports = router;