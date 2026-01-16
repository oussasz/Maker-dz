import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "./middleware/passport.js";
import authRoute from "./Routes/authRoute.js";
import productRoute from "./Routes/productRoute.js";
import userRoute from "./Routes/userRoute.js";
import orderRoute from "./Routes/orderRoute.js";
import categoryRoute from "./Routes/categoryRoute.js";
import cartRoute from "./Routes/cartRoute.js";
import indexRoute from "./Routes/indexRoute.js";
import wishlistRoute from "./Routes/wishlistRoute.js";
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
  })
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
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

// Debug endpoint to check MongoDB connection
app.get("/api/health", async (req, res) => {
  try {
    // Force connection attempt
    await connectDB();

    const dbState = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    // Get actual database name from connection
    const actualDbName =
      mongoose.connection.db?.databaseName || "not connected";

    res.json({
      status: "OK",
      mongodb: states[dbState] || "unknown",
      hasMongoUrl: !!process.env.MONGODB_URL,
      hasDbName: !!process.env.DATABASE_NAME,
      configuredDbName: process.env.DATABASE_NAME,
      actualDbName: actualDbName,
      lastError: connectionError,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MongoDB connection with caching for serverless
let isConnected = false;
let connectionError = null;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const connectionString = process.env.MONGODB_URL;
    const DBName = process.env.DATABASE_NAME;

    if (!connectionString) {
      connectionError = "MONGODB_URL is not defined";
      console.error(connectionError);
      return;
    }

    await mongoose.connect(connectionString, {
      dbName: DBName,
      bufferCommands: false,
    });
    isConnected = true;
    connectionError = null;
    console.log("Connected to MongoDB");
  } catch (error) {
    connectionError = error.message;
    console.error("MongoDB connection error:", error);
  }
};

// Connect on each request (serverless pattern)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/", indexRoute);
app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", orderRoute);
app.use("/api", categoryRoute);
app.use("/api", cartRoute);
app.use("/api", wishlistRoute);
app.use("/api", citiesRoute);

// Start server (cPanel will run this in production)
const PORT = process.env.PORT || 3001;

// Only start server if not imported as a module
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Google OAuth: http://localhost:${PORT}/api/auth/google`);
  });
}

// For compatibility with both cPanel and Vercel
export default app;
