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
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;
