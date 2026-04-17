import mongoose from "mongoose";
const { Schema, model } = mongoose;

const planSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    plan: {
      type: String,
      enum: ["free", "pro", "pro_plus"],
      default: "free",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
    },
    description: {
      en: [
        {
          type: String,
          required: [true, "English description is required"],
        },
      ],
      ar: [
        {
          type: String,
          required: [true, "Arabic description is required"],
        },
      ],
    },
  },
  { timestamps: true },
);

const Plan = model("Plan", planSchema);
export default Plan;
