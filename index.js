import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import passport from "./middleware/mysql/passport.js";
import { connectDB } from "./config/database.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL Routes
import authRoute from "./Routes/mysql/authRoute.js";
import productRoute from "./Routes/mysql/productRoute.js";
import userRoute from "./Routes/mysql/userRoute.js";
import orderRoute from "./Routes/mysql/orderRoute.js";
import categoryRoute from "./Routes/mysql/categoryRoute.js";
import cartRoute from "./Routes/mysql/cartRoute.js";
import wishlistRoute from "./Routes/mysql/wishlistRoute.js";

// Keep original routes that don't need MySQL
import indexRoute from "./Routes/indexRoute.js";
import citiesRoute from "./Routes/citiesRoute.js";

const app = express();

// Add your cPanel domain here after deployment
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://yourdomain.com",
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

// Session configuration for Passport
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Simple ping endpoint (no database required)
app.get("/api/ping", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    env: {
      DB_HOST: process.env.DB_HOST ? "set" : "missing",
      DB_USER: process.env.DB_USER ? "set" : "missing",
      DB_NAME: process.env.DB_NAME ? "set" : "missing",
      DB_PASSWORD: process.env.DB_PASSWORD ? "set" : "missing",
      JWT_SECRET: process.env.JWT_SECRET ? "set" : "missing",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "set" : "missing",
    },
  });
});

// Debug endpoint to check MySQL connection
app.get("/api/health", async (req, res) => {
  try {
    const pool = await connectDB();
    const [rows] = await pool.query(
      "SELECT DATABASE() as db, VERSION() as version",
    );

    // Check if tables exist
    const [tables] = await pool.query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    res.json({
      status: "OK",
      database: rows[0].db || "not selected",
      mysqlVersion: rows[0].version,
      host: process.env.DB_HOST,
      dbUser: process.env.DB_USER,
      dbName: process.env.DB_NAME,
      tables: tableNames,
      tableCount: tableNames.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      code: error.code,
      host: process.env.DB_HOST || "not set",
      dbUser: process.env.DB_USER || "not set",
      dbName: process.env.DB_NAME || "not set",
    });
  }
});

// Initialize MySQL connection on startup
connectDB().catch((err) => {
  console.error("Failed to connect to MySQL:", err);
});

// API Routes - these must come BEFORE the static files
app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", orderRoute);
app.use("/api", categoryRoute);
app.use("/api", cartRoute);
app.use("/api", wishlistRoute);
app.use("/api", citiesRoute);

// Serve static files from the public folder (frontend build)
app.use(express.static(path.join(__dirname, "public")));

// For any route that's not an API route, serve the frontend
// This enables React Router to work properly
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Export app for server.js or direct use
export default app;
