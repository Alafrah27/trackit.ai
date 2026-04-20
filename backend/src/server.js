import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import job from "../cron.config/cron.js";
import connectDB from "../lib/connectDb.js";
import cookieParser from "cookie-parser";
//------------------------
// api routes
//--------------------------
import userRouter from "./route/user.route.js";
import voiceRouter from "./route/ai.service.voice.js";
import orderRouter from "./route/order.route.js";
import planRouter from "./route/plan.route.js";
import SubscriptionCron from "../cron.config/subscription.cron.js";
import expenseRouter from "./route/expense.route.js";

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
  }),
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
app.use("/api/v1/trackit-ai", voiceRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/expenses", expenseRouter);

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 3000;

const ServerStart = async () => {
  try {
    await connectDB();
    SubscriptionCron();
    app.listen(PORT, () => {
      console.log(`✅ MongoDB connected`);
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

ServerStart();
