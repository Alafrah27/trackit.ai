import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncUser, getMe } from "../controller/user.controller.js";

const router = Router();

// POST /api/user/sync — called after Clerk sign-in on the mobile app
router.post("/sync", requireAuth(), syncUser);

// GET /api/user/me — get the current user's MongoDB profile
router.get("/me", requireAuth(), getMe);

export default router;
