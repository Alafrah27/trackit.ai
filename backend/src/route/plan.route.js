import express from "express";
import { createPlan, getPlans } from "../controller/plan.controller.js";
import { verifyJWT } from "../../middleware/jwtAuth.js";
const router = express.Router();

router.post("/", verifyJWT, createPlan);
router.get("/", verifyJWT, getPlans);

export default router;
