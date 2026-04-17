import express from "express";
import { verifyJWT } from "../../middleware/jwtAuth.js";
import { voiceController } from "../controller/voice.controller.js";
import checkSubScription from "../../middleware/checkSubscription.js";

const router = express.Router();

router.post("/", verifyJWT, checkSubScription, voiceController);

export default router;
