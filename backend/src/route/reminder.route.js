import express from "express";
import { verifyJWT } from "../../middleware/jwtAuth.js";
import { getAllReminders, updateReminder, deleteReminder } from "../controller/reminder.controller.js";
const router = express.Router();

router.get("/get-all-reminders", verifyJWT, getAllReminders);
router.put("/update/:id", verifyJWT, updateReminder);
router.delete("/delete/:id", verifyJWT, deleteReminder);

export default router;
