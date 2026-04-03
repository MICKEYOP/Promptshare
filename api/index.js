require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// 🔍 Debug (remove later)
console.log("MONGO_URI =", process.env.MONGO_URI);

// 🔗 MongoDB connect
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// routes (IMPORT)
const authRoutes = require("./routes/authRoutes");
const promptRoutes = require("./routes/promptRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes"); // ⭐ ADD THIS
const aiRoutes = require("./routes/aiRoutes");
const imageRoutes = require("./routes/imageRoutes");

// routes (USE)
app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes); // ⭐ ADD THIS
app.use("/api/ai", aiRoutes);
app.use("/api/images", imageRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
