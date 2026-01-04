import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Environment secret key (fallback if not set)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🔹 Signup Route
router.post("/signup", async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    // Check for missing fields
    if (!userEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userEmail, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// 🔹 Signin Route
router.post("/signin", async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    if (!userEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user existence
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, userEmail: user.userEmail },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send token + email to frontend
    res.json({
      message: "Login successful!",
      token,
      userEmail: user.userEmail,
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ message: "Server error during signin" });
  }
});

// (Optional) 🔹 Route to verify token
router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
});

export default router;
