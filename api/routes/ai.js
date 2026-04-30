const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// Mock AI endpoint since we don't have an API key configured.
// In a real scenario, this would use the @google/genai SDK to hit Gemini.

// @route   POST api/ai/summarize
// @desc    Summarize a note
// @access  Private
router.post(
  "/summarize",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text } = req.body;
      
      // MOCK AI LOGIC
      // const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // const result = await model.generateContent(`Summarize this note in 2 sentences: ${text}`);
      // const summary = result.response.text();

      const summary = "This is a mock AI summary generated for your note. It detects the main points automatically.";
      
      res.json({ summary });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/ai/tags
// @desc    Auto-generate tags for a note
// @access  Private
router.post(
  "/tags",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text } = req.body;
      
      // MOCK AI LOGIC
      const tags = ["AI", "productivity", "mock-tag"];
      
      res.json({ tags });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
