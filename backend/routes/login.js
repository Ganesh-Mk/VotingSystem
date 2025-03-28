const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token or session (if needed)
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt
      // Add any other non-sensitive fields you want to send
    };

    console.log(userResponse)

    res.status(200).json({
      message: "Login successful",
      user: userResponse
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

module.exports = router;