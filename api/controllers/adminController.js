const Prompt = require("../models/Prompt");

/**
 * 📊 GET ALL PROMPTS (ADMIN)
 */
exports.getAllPromptsAdmin = async (req, res) => {
  try {
    const prompts = await Prompt.find()
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });

    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ❌ DELETE ANY PROMPT (ADMIN)
 */
exports.deletePromptAdmin = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    await prompt.deleteOne();
    res.json({ message: "Prompt removed by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ❌ DELETE COMMENT (ADMIN)
 */
exports.deleteCommentAdmin = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.promptId);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    prompt.comments = prompt.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await prompt.save();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
