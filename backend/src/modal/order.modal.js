import mongoose from "mongoose";
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paypalOrderId: {
      type: String,
    },
    paypalPaymentId: {
      type: String,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "pro_plus"],
      default: "free",
    },
  },
  {
    timestamps: true,
  },
);

const Order = model("Order", orderSchema);
export default Order;
