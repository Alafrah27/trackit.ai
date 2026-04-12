import { Router } from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
} from "../controller/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

export default router;
