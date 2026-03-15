import express from "express";
import {
  login,
  refresh,
  register,
  googleAuth,
  googleAuthCallback,
  completeGoogleSignup,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../../controllers/mysql/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/refresh", refresh);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Email verification
router.get("/verify-email/:token", verifyEmail);

// Google OAuth routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);
router.post("/auth/google/complete", completeGoogleSignup);

export default router;
