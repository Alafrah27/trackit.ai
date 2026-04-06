import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { verifyOuth } from "../../middleware/verifyOuth.js";

const router = Router();

router.post("/outh", verifyOuth, registerUser);

export default router;
