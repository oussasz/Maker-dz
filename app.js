// app.js - Entry point for cPanel Passenger
// Load environment variables manually for cPanel compatibility
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env file manually (fallback if dotenv fails)
const envPath = path.join(__dirname, ".env");
if (existsSync(envPath)) {
  try {
    const envContent = readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    });
    console.log("✅ Environment variables loaded from .env");
  } catch (e) {
    console.log("⚠️ Could not load .env file:", e.message);
  }
}

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import mysql from "mysql2/promise";
import passport from "passport";

// Import routes directly (synchronous)
import authRoute from "./Routes/mysql/authRoute.js";
import productRoute from "./Routes/mysql/productRoute.js";
import userRoute from "./Routes/mysql/userRoute.js";
import orderRoute from "./Routes/mysql/orderRoute.js";
import categoryRoute from "./Routes/mysql/categoryRoute.js";
import cartRoute from "./Routes/mysql/cartRoute.js";
import wishlistRoute from "./Routes/mysql/wishlistRoute.js";
import citiesRoute from "./Routes/mysql/citiesRoute.js";

const app = express();

// CORS - Allow your domains
const allowedOrigins = [
  "https://maker-dz.net",
  "https://www.maker-dz.net",
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

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
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Database pool
let dbPool = null;

export const getDB = async () => {
  if (!dbPool) {
    dbPool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log("✅ Database pool created");
  }
  return dbPool;
};

// ============ API ROUTES (MUST BE BEFORE STATIC FILES) ============

// Test endpoint
app.get("/api/ping", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Health check
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
    res.status(500).json({ status: "ERROR", error: error.message });
  }
});

// Register all API routes
app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", orderRoute);
app.use("/api", categoryRoute);
app.use("/api", cartRoute);
app.use("/api", wishlistRoute);
app.use("/api", citiesRoute);

console.log("✅ All API routes registered");

// ============ STATIC FILES (AFTER API ROUTES) ============

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Frontend catch-all (for React Router) - MUST BE LAST
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
