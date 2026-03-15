import jwt from "jsonwebtoken";
import crypto from "crypto";
import argon2 from "argon2";
import {
  User,
  PasswordResetToken,
  EmailVerificationToken,
} from "../../models/mysql/index.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../../utils/emailService.js";
import passport from "../../middleware/mysql/passport.js";

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
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      avatar: user.avatar,
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
    console.log("=== register called ===");
    const { username, email, role, password } = req.body;
    console.log("Registering user:", {
      username,
      email,
      role,
      hasPassword: !!password,
    });

    // Validate required fields
    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({
        error: "Missing required fields",
        missing: {
          username: !username,
          email: !email,
          password: !password,
        },
      });
    }

    // Check if email already exists
    console.log("Checking if email exists...");
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      console.log("Email already exists");
      return res.status(400).json({ error: "Email already taken" });
    }

    // Check if username already exists
    console.log("Checking if username exists...");
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      console.log("Username already exists");
      return res.status(400).json({ error: "Username already taken" });
    }

    console.log("Creating user...");
    const user = await User.create({
      username,
      email,
      role: role || "customer",
      password,
    });
    console.log("User created successfully, ID:", user.id);

    // Generate email verification token (24h expiry)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await EmailVerificationToken.create(user.id, rawToken, expiresAt);

    try {
      await sendVerificationEmail(email, rawToken, username);
    } catch (emailErr) {
      console.error("register — verification email failed:", emailErr);
      // Account is created; don't block registration if email fails
    }

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    console.error("Error stack:", error.stack);
    console.error("SQL Error:", error.sqlMessage || "N/A");
    res.status(500).json({
      error: "Error registering user",
      details: error.message,
      code: error.code || "UNKNOWN",
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
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      avatar: user.avatar,
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
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        avatar: user.avatar,
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

// ─── Password Reset ─────────────────────────────────────────────────────────

/**
 * POST /api/forgot-password
 * Body: { email }
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const user = await User.findByEmail(email);

    // No account with that email
    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found with this email address." });
    }

    // Account created via Google — no password to reset
    if (user.auth_provider === "google") {
      return res.status(400).json({
        error:
          "This account was created with Google. Please sign in with Google.",
      });
    }

    // Remove any existing tokens for this user, then create a fresh one
    await PasswordResetToken.deleteByUserId(user.id);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create(user.id, rawToken, expiresAt);

    try {
      const userName = user.first_name || user.username;
      await sendPasswordResetEmail(user.email, rawToken, userName);
    } catch (emailErr) {
      console.error("forgotPassword — email send failed:", emailErr);
      return res
        .status(500)
        .json({ error: `Could not send the reset email: ${emailErr.message}` });
    }

    return res.status(200).json({
      message: "A password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/reset-password
 * Body: { token, newPassword }
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Token is required" });
    }

    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // Look up the token (also checks expiry and used_at)
    const record = await PasswordResetToken.findByToken(token);
    if (!record) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password with Argon2id
    const hashedPassword = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });

    // Update the user's password directly (skipping double-hashing)
    await User.updatePassword(record.user_id, hashedPassword);

    // Mark the token as used so it cannot be replayed
    await PasswordResetToken.markUsed(record.id);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Email Verification ─────────────────────────────────────────────────────

/**
 * GET /api/verify-email/:token
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Token is required" });
    }

    const record = await EmailVerificationToken.findByToken(token);
    if (!record) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    // Mark email as verified
    await User.updateById(record.user_id, { emailVerified: true });

    // Mark token as used
    await EmailVerificationToken.markUsed(record.id);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({ error: "Internal server error" });
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
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        avatar: user.avatar,
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
