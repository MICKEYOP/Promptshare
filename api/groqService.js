const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateWithGroq = async (promptText) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are an expert prompt engineer."
        },
        {
          role: "user",
          content: promptText
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("GROQ ERROR:", error);
    throw new Error("Groq generation failed");
  }
};

module.exports = { generateWithGroq };
