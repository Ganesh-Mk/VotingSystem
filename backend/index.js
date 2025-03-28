const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Passport Initialization
require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env file");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Import routes
const getAllUsersRoute = require("./routes/getAll");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const getUserRoute = require("./routes/getUser");
const googleAuthRoute = require("./routes/googleAuth");

// User routes
app.use(signupRoute);
app.use(loginRoute);
app.use(getAllUsersRoute);
app.use(getUserRoute);
app.use("/auth", googleAuthRoute); // Mount Google OAuth routes under /auth

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});