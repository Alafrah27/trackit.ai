import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/modal/user.modal.js";
import connectDB from "./lib/connectDb.js";
dotenv.config();

const testDb = async () => {
    try {
        await connectDB();
        const testUser = new User({
            name: "Test User",
            email: `test_${Date.now()}@example.com`,
            password: "hashedpassword123",
            otp: "123456"
        });
        await testUser.save();
        console.log("Successfully saved user!");
        process.exit(0);
    } catch (e) {
        console.error("DB SAVE ERROR:", e.message);
        process.exit(1);
    }
};

testDb();
