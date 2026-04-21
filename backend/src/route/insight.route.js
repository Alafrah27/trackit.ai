import { Router } from "express";
import { getMonthlyInsights } from "../controller/insight.controller.js";
import { verifyJWT } from "../../middleware/jwtAuth.js";

const router = Router();

router.get("/", verifyJWT, getMonthlyInsights);

export default router;
