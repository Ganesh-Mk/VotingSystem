const express = require("express");
const router = express.Router();
const passport = require("passport");

// Initiate Google OAuth
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?userId=${req.user._id}&fullName=${encodeURIComponent(req.user.fullName)}&email=${encodeURIComponent(req.user.email)}`);
  }
);

// Get current user
router.get("/current_user", (req, res) => {
  res.json(req.user || null);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router;