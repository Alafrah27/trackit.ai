import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import job from "../lib/cron.js";
import connectDB from "../lib/connectDb.js";
import userRouter from "./route/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

job.start();

// ─── Security Headers ───────────────────────────────────────────────
app.use(helmet());

// ─── CORS Configuration ─────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true, // Allow cookies for refresh token
  })
);

// ─── Standard Middleware ─────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent payload attacks
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public health-check
app.get("/", (req, res) => {
  res.send("TrackIt Backend is running! 🚀");
});

// API Routes
app.use("/api/v1/user", userRouter);

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ MongoDB connected`);
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
