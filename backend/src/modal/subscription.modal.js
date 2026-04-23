import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "pro_plus"],
      default: "free",
    },
    paymentMethod: {
      type: String,
      default: "paypal",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    limits: {
      reminders: {
        type: Number,
      },
      emails: {
        type: Number,
      },
      expenses: {
        type: Number,
      },
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },

  { timestamps: true },
);

const Subscription = model("Subscription", subscriptionSchema);
export default Subscription;
