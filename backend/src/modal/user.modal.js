import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [4, "Name must be at least 4 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      trim: true,
      // For stricter phone validation you can uncomment this:
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please provide a valid phone number (E.164 format)",
      ],
    },
    expoPushToken: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // ─── OTP Verification ────────────────────────────────────────────
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    ExpireOtp: {
      type: Date,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },

    // ─── Password Reset ──────────────────────────────────────────────
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },

    // ─── Refresh Token (hashed) ──────────────────────────────────────
    refreshToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    usage: {
      reminderUsed: { type: Number, default: 0 },
      emailUsed: { type: Number, default: 0 },
      expenseUsed: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);
export default User;
