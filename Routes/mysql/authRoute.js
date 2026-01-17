import express from "express";
import {
  login,
  refresh,
  register,
  googleAuth,
  googleAuthCallback,
} from "../../controllers/mysql/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/refresh", refresh);

// Google OAuth routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);

export default router;
