import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import job from "../lib/cron.js";
import connectDB from "../lib/connectDb.js";
import userRouter from "./route/user.route.js";

dotenv.config();

const app = express();

job.start();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Clerk middleware globally (validates every request that carries a session token)
app.use(clerkMiddleware());

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
