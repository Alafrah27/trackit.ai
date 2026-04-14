import User from "../modal/user.modal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { MailWelcome } from "../../lib/nodeEmail.js";

dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2y", // 2 years
  });
};

const generateOTP = () => {
  // Generates exactly a 5-digit OTP (10000 to 99999) as a string
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Remove 'otp' from req.body since it shouldn't be sent by the client
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp: otpCode,
      ExpireOtp: Date.now() + 60 * 1000, // Expires in exactly 1 minute (60,000 ms)
    });

    await newUser.save();

    // Actively dispatch the stunning Resend HTML email!
    try {
      await MailWelcome(email, name, otpCode);
    } catch (error) {
      console.log("Error sending welcome   email:", error);
    }
    console.log(`[DEBUG] OTP for ${email}: ${otpCode}`);

    return res.status(201).json({
       success: true 
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.ExpireOtp < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    // Strict comparison works perfectly now since both are strings
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear the OTP securely after successful verification
    await user.save();

    const token = generateToken(user._id);
    return res.status(200).json({
      message: "User verified successfully",
      token,
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

    const user = await User.findOne({ email });
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

    const token = generateToken(user._id);
    return res.status(200).json({
      message: "User logged in successfully",
      token,
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



export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const otpCode = generateOTP();
    user.otp = otpCode;
    user.ExpireOtp = Date.now() + 60 * 1000;
    await user.save();
    await MailWelcome(email, user.name, otpCode);
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};    