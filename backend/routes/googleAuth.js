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
    // Redirect to frontend with userId as a query parameter
    res.redirect(`${process.env.FRONTEND_URL}/login?userId=${req.user._id}`);
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