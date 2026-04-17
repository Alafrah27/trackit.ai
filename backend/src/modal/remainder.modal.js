import mongoose from "mongoose";
const { Schema, model } = mongoose;

const remainderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    message: {
      en: { type: String, required: [true, "English title is required"] },
      ar: { type: String, required: [true, "Arabic title is required"] },
    },
    description: {
      en: { type: String, required: [true, "English description is required"] },
      ar: { type: String, required: [true, "Arabic description is required"] },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    action: {
      type: String,
      enum: ["notify", "call"],
      default: "notify",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isNotificationSent: {
      type: Boolean,
      default: false,
    },
    isCallSent: {
      type: Boolean,
      default: false,
    },
    isEmailSent: {
      type: Boolean,
      default: false,
    },
    isPushNotificationSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Remainder = model("Remainder", remainderSchema);
export default Remainder;
