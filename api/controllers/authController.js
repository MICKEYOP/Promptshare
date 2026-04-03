const User = require("../models/accountModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   ✅ REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required"
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      savedPrompts: []
    });

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Registration failed"
    });
  }
};

/* =========================
   ✅ LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("savedPrompts");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // 🔐 JWT (INCLUDES USERNAME)
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RESPONSE TO FRONTEND
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        savedPrompts: user.savedPrompts.map(p => p._id)
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Login failed"
    });
  }
};
