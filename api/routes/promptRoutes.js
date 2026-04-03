const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
createPrompt,
getAllPrompts,
getPromptById,
updatePrompt,
deletePrompt,
toggleLike,
toggleSavePrompt,
addComment,
getTrendingPrompts,
getTopContributors
} = require("../controllers/promptController");

// =============================
// ➕ CREATE PROMPT (protected + image upload)
// =============================
router.post(
"/",
auth,
upload.single("image"),
createPrompt
);

// =============================
// 📄 READ PROMPTS
// =============================

// 🔥 TRENDING (MUST BE ABOVE :id)
router.get("/trending", getTrendingPrompts);

// 🏆 TOP CONTRIBUTORS (MUST BE ABOVE :id)
router.get("/top-contributors", getTopContributors);

// 📄 GET ALL PROMPTS
router.get("/", getAllPrompts);

// ⚠️ KEEP THIS LAST (important!)
router.get("/:id", getPromptById);

// =============================
// ✏️ UPDATE PROMPT (protected + image update)
// =============================
router.put(
"/:id",
auth,
upload.single("image"),
updatePrompt
);

// =============================
// 🗑 DELETE PROMPT (protected)
// =============================
router.delete("/:id", auth, deletePrompt);

// =============================
// ❤️ LIKE / UNLIKE PROMPT
// =============================
router.post("/:id/like", auth, toggleLike);

// =============================
// ⭐ SAVE / UNSAVE PROMPT
// =============================
router.post("/:id/save", auth, toggleSavePrompt);

// =============================
// 💬 ADD COMMENT
// =============================
router.post("/:id/comments", auth, addComment);

module.exports = router;
