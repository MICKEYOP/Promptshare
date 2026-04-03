const User = require("../models/accountModel");
const Prompt = require("../models/Prompt");




/**
 * ⭐ GET SAVED PROMPTS
 * GET /api/users/saved
 */
exports.getSavedPrompts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedPrompts = await Prompt.find({
      _id: { $in: user.savedPrompts }
    })
      .populate("createdBy", "username email") // 🔥 THIS FIXES UNKNOWN
      .sort({ createdAt: -1 });

    res.json(savedPrompts);

  } catch (err) {
    console.error("GET SAVED ERROR:", err);
    res.status(500).json({ message: "Failed to load saved prompts" });
  }
};

/**
 * 👤 GET MY CREATED PROMPTS
 * GET /api/users/my-prompts
 */
exports.getMyPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(prompts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user prompts"
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, discordId, about } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 🔥 Update fields only if provided
    if (username && username.trim()) {
      user.username = username.trim();
    }

    if (discordId !== undefined) {
      user.discordId = discordId.trim();
    }

    if (about !== undefined) {
      user.about = about.trim();
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        discordId: user.discordId,
        about: user.about,
        joinedAt: user.joinedAt,
        isTopCreator: user.isTopCreator,
        role: user.role
      }
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      message: "Failed to update profile"
    });
  }
};


/* =====================
   📈 USER ANALYTICS
===================== */
exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // ===== TOTALS =====
    const totalPrompts = await Prompt.countDocuments({
      createdBy: userId
    });

    const totalLikesAgg = await Prompt.aggregate([
      { $match: { createdBy: userId } },
      { $project: { likesCount: { $size: "$likes" } } },
      { $group: { _id: null, total: { $sum: "$likesCount" } } }
    ]);

    const totalViewsAgg = await Prompt.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);

    // ===== 📈 DAILY ANALYTICS =====
    const daily = await Prompt.aggregate([
      { $match: { createdBy: userId } },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          likes: { $size: "$likes" },
          views: "$views"
        }
      },
      {
        $group: {
          _id: "$date",
          likes: { $sum: "$likes" },
          views: { $sum: "$views" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      prompts: totalPrompts,
      likes: totalLikesAgg[0]?.total || 0,
      views: totalViewsAgg[0]?.total || 0,
      daily // 🔥 THIS IS REQUIRED FOR ANALYTICS
    });
  } catch (error) {
    console.error("PROFILE STATS ERROR:", error);
    res.status(500).json({ message: "Failed to load stats" });
  }
};

exports.toggleFollow = async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user.id;

  if (targetUserId === currentUserId) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // ❌ UNFOLLOW
    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);
  } else {
    // ✅ FOLLOW
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  }

  await currentUser.save();
  await targetUser.save();

  res.json({
    following: !isFollowing,
    followersCount: targetUser.followers.length
  });
};


// 🌍 GET PUBLIC PROFILE
exports.getPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select("username email avatar followers following joinedAt discordId about");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 GET TOP CONTRIBUTORS LIST
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
      { $limit: 5 }
    ]);

    const isTopCreator = topUsers.some(
      (u) => u._id.toString() === userId
    );

    const prompts = await Prompt.find({
      createdBy: userId
    }).sort({ createdAt: -1 });

    res.json({
      user: {
        ...user.toObject(),
        isTopCreator
      },
      prompts
    });

  } catch (error) {
    console.error("PUBLIC PROFILE ERROR:", error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};