const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const uploadAvatar = require("../middleware/avatarUpload"); // 🖼️ NEW
const User = require("../models/accountModel");
const Prompt = require("../models/Prompt");
const { toggleFollow } = require("../controllers/userController");



const {
  getSavedPrompts,
  getMyPrompts,
  updateProfile,
  getPublicProfile
} = require("../controllers/userController");

/* =====================
   ⭐ GET SAVED PROMPTS
===================== */
router.get("/saved", auth, getSavedPrompts);

/* =====================
   👤 GET MY PROMPTS
===================== */
router.get("/my-prompts", auth, getMyPrompts);

/* =====================
   ✏️ UPDATE PROFILE (USERNAME)
===================== */
router.put("/profile", auth, updateProfile);

/* =====================
   🖼️ UPDATE PROFILE AVATAR
===================== */
router.put(
  "/profile/avatar",
  auth,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Avatar image required" });
      }

      const user = await User.findById(req.user.id);
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      res.json({
        message: "Avatar updated",
        user
      });
    } catch (error) {
      console.error("AVATAR UPDATE ERROR:", error);
      res.status(500).json({
        message: "Failed to update avatar"
      });
    }
  }
);

/* =====================
   🔐 CHANGE PASSWORD
===================== */
router.put("/profile/password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "All fields required" });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await require("bcryptjs").compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect old password" });
    }

    user.password = await require("bcryptjs").hash(
      newPassword,
      10
    );
    await user.save();

    res.json({
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("PASSWORD UPDATE ERROR:", error);
    res.status(500).json({
      message: "Failed to update password"
    });
  }
});


/* =====================
   📊 PROFILE STATS
===================== */
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const prompts = await Prompt.find({ createdBy: userId });

    const totalPrompts = prompts.length;
    const totalLikes = prompts.reduce(
      (sum, p) => sum + p.likes.length,
      0
    );
    const totalViews = prompts.reduce(
      (sum, p) => sum + (p.views || 0),
      0
    );

    // 📈 DAILY ANALYTICS
    const daily = {};

    prompts.forEach((p) => {
      const date = p.createdAt.toISOString().split("T")[0];

      if (!daily[date]) {
        daily[date] = { views: 0, likes: 0 };
      }

      daily[date].views += p.views || 0;
      daily[date].likes += p.likes.length;
    });

    res.json({
      prompts: totalPrompts,
      likes: totalLikes,
      views: totalViews,
      daily: Object.entries(daily).map(([date, v]) => ({
        date,
        views: v.views,
        likes: v.likes
      }))
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

// Follow / Unfollow
router.post("/follow/:id", auth, toggleFollow);

/* =====================
   🌍 PUBLIC PROFILE  (⚠️ MUST BE LAST)
===================== */

router.get("/:id", getPublicProfile);

module.exports = router;
