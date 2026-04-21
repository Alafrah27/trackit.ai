import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    title: { 
      en: { type: String, required: [true, " title is required"] },
      ar: { type: String, required: [true, " العنوان مطلوب"] },
    },
    category: {
      en: { type: String, required: [true, " category is required"] },
      ar: { type: String, required: [true, " التصنيف مطلوب"] },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Expense = model("Expense", expenseSchema);
export default Expense;
