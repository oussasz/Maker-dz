// app.js - Entry point for cPanel Passenger
// Passenger expects this specific format

import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add your cPanel domain here
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://maker-dz.net",
  "https://maker-dz.net",
  "https://www.maker-dz.net",
  "https://maker-app-frontend.vercel.app",
  "https://maker-app-frontend-ruddy.vercel.app",
  "https://maker-dz.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to false for testing
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Database pool (created once)
let dbPool = null;

const getDB = async () => {
  if (!dbPool) {
    console.log("Creating database pool...");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_NAME:", process.env.DB_NAME);
    console.log("DB_USER:", process.env.DB_USER);

    dbPool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log("Database pool created");
  }
  return dbPool;
};

// Simple test endpoint - works without database
app.get("/api/ping", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: {
      DB_HOST: process.env.DB_HOST ? "✓ set" : "✗ missing",
      DB_USER: process.env.DB_USER ? "✓ set" : "✗ missing",
      DB_NAME: process.env.DB_NAME ? "✓ set" : "✗ missing",
      DB_PASSWORD: process.env.DB_PASSWORD ? "✓ set" : "✗ missing",
      JWT_SECRET: process.env.JWT_SECRET ? "✓ set" : "✗ missing",
    },
  });
});

// Health check with database
app.get("/api/health", async (req, res) => {
  try {
    const pool = await getDB();
    const [rows] = await pool.query(
      "SELECT DATABASE() as db, VERSION() as version",
    );
    const [tables] = await pool.query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    res.json({
      status: "OK",
      database: rows[0].db,
      mysqlVersion: rows[0].version,
      tables: tableNames,
      tableCount: tableNames.length,
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      code: error.code,
    });
  }
});

// Flag to track if routes are loaded
let routesLoaded = false;

// Lazy load routes
const loadRoutes = async () => {
  if (routesLoaded) return;

  try {
    console.log("Loading routes...");

    // Import passport
    const passportModule = await import("./middleware/mysql/passport.js");
    const passport = passportModule.default;
    app.use(passport.initialize());
    app.use(passport.session());

    // Import routes
    const authRoute = (await import("./Routes/mysql/authRoute.js")).default;
    const productRoute = (await import("./Routes/mysql/productRoute.js"))
      .default;
    const userRoute = (await import("./Routes/mysql/userRoute.js")).default;
    const orderRoute = (await import("./Routes/mysql/orderRoute.js")).default;
    const categoryRoute = (await import("./Routes/mysql/categoryRoute.js"))
      .default;
    const cartRoute = (await import("./Routes/mysql/cartRoute.js")).default;
    const wishlistRoute = (await import("./Routes/mysql/wishlistRoute.js"))
      .default;
    const citiesRoute = (await import("./Routes/citiesRoute.js")).default;

    // Register routes
    app.use("/api", authRoute);
    app.use("/api", productRoute);
    app.use("/api", userRoute);
    app.use("/api", orderRoute);
    app.use("/api", categoryRoute);
    app.use("/api", cartRoute);
    app.use("/api", wishlistRoute);
    app.use("/api", citiesRoute);

    routesLoaded = true;
    console.log("✅ All routes loaded successfully");
  } catch (error) {
    console.error("❌ Error loading routes:", error);
    console.error(error.stack);
  }
};

// Load routes immediately
loadRoutes();

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Catch-all for frontend routing
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

// Export for Passenger
export default app;

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
