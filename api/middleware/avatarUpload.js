const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) => {
    cb(
      null,
      `avatar-${req.user.id}${path.extname(file.originalname)}`
    );
  }
});

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images allowed"));
    }
    cb(null, true);
  },
  storage
});

module.exports = upload;
