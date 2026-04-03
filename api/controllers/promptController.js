const Prompt = require("../models/Prompt");
const updateTopCreators = require("../utils/updateTopCreators");
const Account = require("../models/accountModel");

// ➕ CREATE PROMPT
exports.createPrompt = async (req, res) => {
  try {
    const { title, promptText, description, tags } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const prompt = await Prompt.create({
      title,
      promptText,
      description,
      tags,
      image: imageUrl, // 🖼 save image
      createdBy: req.user.id
    });

    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📄 GET ALL PROMPTS (search + pagination)
exports.getAllPrompts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const sort = req.query.sort || "newest";

    const skip = (page - 1) * limit;

    let matchStage = {};

    if (search) {
      matchStage = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { promptText: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } }
        ]
      };
    }

    let sortStage = { createdAt: -1 };

    if (sort === "likes") sortStage = { likesCount: -1 };
    if (sort === "views") sortStage = { views: -1 };

    const pipeline = [
      { $match: matchStage },
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit }
    ];

    const prompts = await Prompt.aggregate(pipeline);

    await Prompt.populate(prompts, {
      path: "createdBy",
      select: "username email"
    });

    const total = await Prompt.countDocuments(matchStage);

    res.json({
      prompts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPrompts: total
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// 📄 GET PROMPT BY ID
exports.getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("createdBy", "username email followers isTopCreator") // 🔥 FIXED
      .populate("comments.user", "username email");      // 🔥 FIXED

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    let isFollowing = false;

    if (req.user && prompt.createdBy.followers) {
      isFollowing = prompt.createdBy.followers.some(
        (id) => id.toString() === req.user.id
      );
    }

    res.json({
      ...prompt.toObject(),
      isFollowing
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ✏️ UPDATE PROMPT (OWNER ONLY)
exports.updatePrompt = async (req, res) => {
  try {
    const { title, promptText, description, tags } = req.body;

    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // 🔐 FIXED ownership check
    if (prompt.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this prompt"
      });
    }

    prompt.title = title || prompt.title;
    prompt.promptText = promptText || prompt.promptText;
    prompt.description = description || prompt.description;
    prompt.tags = tags || prompt.tags;

    await prompt.save();

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🗑 DELETE PROMPT (OWNER ONLY)
exports.deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    if (prompt.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this prompt" });
    }

    await prompt.deleteOne();
    res.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❤️ LIKE / UNLIKE PROMPT
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user?._id; // safe access

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // ensure likes array exists
    if (!prompt.likes) {
      prompt.likes = [];
    }

    const isLiked = prompt.likes.some(
      (id) => id && id.toString() === userId.toString()
    );

    if (isLiked) {
      prompt.likes = prompt.likes.filter(
        (id) => id && id.toString() !== userId.toString()
      );
    } else {
      prompt.likes.push(userId);
    }

    await prompt.save();

    res.json({
      message: isLiked ? "Unliked" : "Liked",
      likesCount: prompt.likes.length,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ SAVE / UNSAVE PROMPT
exports.toggleSavePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Ensure savedBy exists
    if (!prompt.savedBy) {
      prompt.savedBy = [];
    }

    const alreadySaved = prompt.savedBy.some(
      (id) => id && id.toString() === userId
    );

    if (alreadySaved) {
      // ❌ REMOVE SAVE
      prompt.savedBy = prompt.savedBy.filter(
        (id) => id && id.toString() !== userId
      );
    } else {
      // ⭐ ADD SAVE
      prompt.savedBy.push(userId);
    }

    await prompt.save();

    res.json({
      saved: !alreadySaved,
      count: prompt.savedBy.length
    });

  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



/**
 * 💬 ADD COMMENT
 * POST /api/prompts/:id/comments
 */
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    prompt.comments.push({
      text,
      user: req.user.id
    });

    await prompt.save();

    const updatedPrompt = await Prompt.findById(req.params.id)
      .populate("comments.user", "username email"); // 🔥 FIXED

    res.status(201).json(updatedPrompt.comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 GET TRENDING PROMPTS
exports.getTrendingPrompts = async (req, res) => {
  try {
    const trending = await Prompt.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" }
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$likesCount", 3] },
              { $multiply: ["$commentsCount", 2] },
              "$views"
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);

    await Prompt.populate(trending, {
      path: "createdBy",
      select: "username email"
    });

    res.json(trending);

  } catch (error) {
    console.error("TRENDING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🏆 GET TOP CONTRIBUTORS
exports.getTopContributors = async (req, res) => {
  try {
    const topUsers = await Prompt.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" }
        }
      },
      {
        $group: {
          _id: "$createdBy",
          totalPrompts: { $sum: 1 },
          totalLikes: { $sum: "$likesCount" },
          totalViews: { $sum: "$views" }
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$totalLikes", 3] },
              { $multiply: ["$totalPrompts", 2] },
              "$totalViews"
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ]);

    res.json(topUsers);

  } catch (error) {
    console.error("TOP CONTRIBUTORS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

