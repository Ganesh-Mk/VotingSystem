const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust path to your User model

// Get user details by userId (using query params)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User details:", user);

    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

module.exports = router;