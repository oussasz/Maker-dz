import jwt from "jsonwebtoken";
import { User } from "../../models/mysql/index.js";
import passport from "../../middleware/passport.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const passwordMatch = await User.comparePassword(user.password, password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    console.log("Registering user with data:", { username, email, role });

    // Validate required fields
    if (!username || !email || !password) {
      console.error("Missing required fields:", {
        username: !!username,
        email: !!email,
        password: !!password,
      });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email already exists
    console.log("Checking if email exists...");
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      console.log("Email already exists:", email);
      return res.status(400).json({ error: "Email already taken" });
    }

    // Check if username already exists
    console.log("Checking if username exists...");
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      console.log("Username already exists:", username);
      return res.status(400).json({ error: "Username already taken" });
    }

    console.log("Creating user...");
    const user = await User.create({
      username,
      email,
      role: role || "customer",
      password,
    });

    console.log("User registered successfully:", user.id);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
    });
    res.status(500).json({
      error: "Error registering user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    // Get refresh token from Authorization header
    const authHeader = req.headers.authorization;
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const newAccessToken = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    res.status(500).json({ error: "Error refreshing token" });
  }
};

// Google OAuth - Initiate authentication
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google OAuth - Callback handler
export const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Google OAuth error:", err);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=authentication_failed`,
      );
    }

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=no_user_found`,
      );
    }

    try {
      // Generate tokens for the authenticated user
      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      const accessToken = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // Redirect to frontend with tokens
      const redirectUrl = `${
        process.env.FRONTEND_URL
      }/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(
        JSON.stringify(userData),
      )}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error generating tokens:", error);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=token_generation_failed`,
      );
    }
  })(req, res, next);
};
