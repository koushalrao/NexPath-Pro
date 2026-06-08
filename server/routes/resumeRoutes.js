const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const pdfParse = require("pdf-parse");
const mammoth  = require("mammoth");
const axios    = require("axios");
const verifyToken = require("../middleware/verifyToken");

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    cb(null, allowed.includes(file.mimetype));
  },
});

// POST /api/resume/analyze (protected)
router.post("/analyze", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Extract text
    let text = "";
    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    }

    if (!text.trim()) {
      return res.status(400).json({ message: "Could not extract text from file" });
    }

    // If no API key, return basic analysis
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        atsScore: null,
        summary:  "AI analysis unavailable — add ANTHROPIC_API_KEY to enable full scoring.",
        extractedText: text.slice(0, 500),
      });
    }

    // AI analysis via Claude
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: `Analyze this resume for a CS student in India applying to tech companies.
Return a JSON object with these exact keys:
{
  "atsScore": <number 0-100>,
  "strengths": [<up to 3 short strings>],
  "improvements": [<up to 4 short strings>],
  "missingKeywords": [<up to 6 relevant tech keywords not found>],
  "summary": "<2 sentence overall assessment>"
}
Respond with only valid JSON, no markdown.

Resume text:
${text.slice(0, 3000)}`,
        }],
      },
      {
        headers: {
          "x-api-key":         process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type":      "application/json",
        },
      }
    );

    const raw = response.data.content[0].text;
    const analysis = JSON.parse(raw);
    res.json(analysis);
  } catch (err) {
    console.error("Resume error:", err.message);
    res.status(500).json({ message: "Resume analysis failed" });
  }
});

module.exports = router;