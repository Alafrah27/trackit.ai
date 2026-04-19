import User from "../modal/user.modal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { MailWelcome, MailResetPassword } from "../../lib/nodeEmail.js";
import crypto from "crypto";

dotenv.config();

// ─── Helpers ─────────────────────────────────────────────────────────────
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // 15 minutes
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // 30 days
  });
};

const generateOTP = () => {
  // Generates exactly a 5-digit OTP (10000 to 99999) as a string
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

// ─── Controllers ────────────────────────────────────────────────────────

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      otp: otpCode,
      ExpireOtp: Date.now() + 60 * 1000, // Expires in exactly 1 minute (60,000 ms)
    });

    await newUser.save();

    // Actively dispatch the stunning Resend HTML email!
    try {
      await MailWelcome(normalizedEmail, name, otpCode);
    } catch (error) {
      console.log("Error sending welcome email:", error);
    }
    console.log(`[DEBUG] OTP for ${normalizedEmail}: ${otpCode}`);

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error("Registration Error: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if account is locked due to too many failed OTP attempts
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        message: `Too many attempts. Try again in ${remainingTime} minutes.`,
      });
    }

    if (user.ExpireOtp < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Strict comparison works perfectly now since both are strings
    if (user.otp !== otp) {
      // Increment attempt counter and check for lockout
      user.otpAttempts += 1;
      if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        user.lockedUntil = Date.now() + OTP_LOCKOUT_MS;
        await user.save();
        return res.status(429).json({
          message: "Too many failed attempts. Account locked for 15 minutes.",
        });
      }
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear the OTP securely after successful verification
    user.otpAttempts = 0;
    user.lockedUntil = null;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Hash refresh token before saving to db
    const salt = await bcrypt.genSalt(10);
    user.refreshToken = await bcrypt.hash(refreshToken, salt);

    await user.save();

    // Set HttpOnly cookie for web clients (mobile will just use the returned refreshToken)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      message: "User verified successfully",
      token: accessToken,
      refreshToken, // Return for mobile clients
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Must check if user is verified before allowing login
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account before logging in" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Hash refresh token before saving
    const salt = await bcrypt.genSalt(10);
    user.refreshToken = await bcrypt.hash(refreshToken, salt);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token: accessToken,
      refreshToken, // Return for mobile clients
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login bug: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Prevent resending too often (cooldown of 60 seconds)
    if (user.ExpireOtp && user.ExpireOtp > Date.now()) {
      return res
        .status(429)
        .json({ message: "Please wait before requesting a new OTP" });
    }

    const otpCode = generateOTP();
    user.otp = otpCode;
    user.ExpireOtp = Date.now() + 60 * 1000;
    user.otpAttempts = 0; // Reset attempts on resend
    await user.save();

    await MailWelcome(normalizedEmail, user.name, otpCode);

    console.log(`[DEBUG] Resent OTP for ${normalizedEmail}: ${otpCode}`);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "-password -refreshToken -otp -resetPasswordOtp",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        message: "If your email is registered, you will receive a reset code.",
      });
    }

    const resetCode = generateOTP();
    user.resetPasswordOtp = resetCode;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await MailResetPassword(normalizedEmail, user.name, resetCode);
    console.log(
      `[DEBUG] Reset Password OTP for ${normalizedEmail}: ${resetCode}`,
    );

    return res.status(200).json({
      message: "If your email is registered, you will receive a reset code.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found or invalid request." });
    }

    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    // Invalidate potentially compromised refresh tokens
    user.refreshToken = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const isValidToken = await bcrypt.compare(
      incomingRefreshToken,
      user.refreshToken,
    );

    if (!isValidToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const salt = await bcrypt.genSalt(10);
    user.refreshToken = await bcrypt.hash(newRefreshToken, salt);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// upate expo push token

export const updateExpoToken = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedExpoToken = await User.findByIdAndUpdate(
      userId,
      { expoPushToken },
      { new: true },
    );
    await updatedExpoToken.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update Expo Push Token Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update phoneNumber

export const updatePhoneNumber = async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatUserPhoneNumber = await User.findByIdAndUpdate(
      userId,
      { phone },
      { new: true },
    );
    await updatUserPhoneNumber.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update Phone Number Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
