const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(
  session({
    secret: "flame-grill-super-secret-key", // In a real app, use environment variables
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Hardcoded admin credentials for demonstration
const ADMIN_PASSWORD = "password123";

// --- API Routes ---

// Login Endpoint
app.post("/api/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    res.status(200).json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

// Logout Endpoint
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ success: true, message: "Logout successful" });
});

// Protected API Endpoint to get Dashboard Data
app.get("/api/dashboard-data", (req, res) => {
  // Check if user is authenticated
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Send back some dummy data
  res.json({
    success: true,
    stats: {
      totalOrders: 142,
      revenue: "$3,450",
      activeUsers: 24,
      pendingMessages: 5,
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
