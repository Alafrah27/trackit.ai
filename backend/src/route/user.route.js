import { Router } from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
  resendOTP,
  UserProfile,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logoutUser,
  updateExpoToken,
  updatePhoneNumber,
} from "../controller/user.controller.js";
import { verifyJWT } from "../../middleware/jwtAuth.js";
import rateLimit from "express-rate-limit";

const router = Router();

// ─── Rate Limiters ───────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: { message: "Too many requests, please try again slow down" },
});

// ─── Authentication Routes ─────────────────────────────────────────
router.post("/register", authLimiter, registerUser);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/login", authLimiter, loginUser);
router.post("/resend-otp", authLimiter, resendOTP);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

// ─── Token Management Routes ───────────────────────────────────────
router.post("/refresh-token", refreshAccessToken);

// ─── Protected Routes ────────────────────────────────────────────
router.get("/profile", verifyJWT, apiLimiter, UserProfile);
router.post("/logout", verifyJWT, logoutUser);

// update expo push token and phone number
router.put("/update-expo-push-token", verifyJWT, updateExpoToken);
router.put("/update-phone-number", verifyJWT, updatePhoneNumber);

export default router;
