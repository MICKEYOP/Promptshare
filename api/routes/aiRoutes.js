const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/enhance", auth, async (req, res) => {
  try {
    const { text, tone } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Prompt text required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ FIXED MODEL
      messages: [
        {
          role: "system",
          content:
            "You are an expert prompt engineer. Improve prompts clearly and professionally.",
        },
        {
          role: "user",
          content: `Tone: ${tone || "professional"}\n\nPrompt:\n${text}`,
        },
      ],
      temperature: 0.7,
    });

    const enhancedPrompt = completion.choices[0].message.content;

    res.json({ enhancedPrompt });
  } catch (error) {
    console.error("GROQ ERROR:", error);
    res.status(500).json({ message: "AI enhancement failed" });
  }
});

module.exports = router;
