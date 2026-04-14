import { Router } from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
 resendOTP,
} from "../controller/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/resend-otp",resendOTP);

export default router;
