import express from "express";
import { verifyJWT } from "../../middleware/jwtAuth.js";
import { getAllReminders } from "../controller/reminder.controller.js";
const router = express.Router();

router.get("/get-all-reminders", verifyJWT, getAllReminders);

export default router;
