const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/userModel");

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user with Google data
        user = new User({
          fullName: profile.displayName,
          email,
          googleId: profile.id,
          image: profile.photos[0].value, // Add this line to save profile image
          createdAt: Date.now()
        });
        await user.save();
      } else {
        // Update existing user with latest image if needed
        user.image = profile.photos[0].value;
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});