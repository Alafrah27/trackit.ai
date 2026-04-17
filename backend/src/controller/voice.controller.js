import { processVoice } from "../services/ai.service.js";
import Remainder from "../modal/remainder.modal.js";
import Expense from "../modal/expense.modal.js";
import Subscription from "../modal/subscription.modal.js";
import User from "../modal/user.modal.js";

export const voiceController = async (req, res) => {
  try {
    const { text, session } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);
    let sub = await Subscription.findOne({ userId });

    if (!user) {
      return res.json({ error: "User not found" });
    }

    // Auto-create a free subscription for existing users that don't have one
    if (!sub) {
      sub = await Subscription.create({ userId, plan: "free" });
    }

    const ai = await processVoice(text, session);

    // ❓ Question
    if (ai.type === "question") {
      return res.json({
        speak: ai.question,
        session: ai.session,
      });
    }

    // 💸 Expense
    if (ai.type === "expense") {
      // 🔥 check limit
      if (
        user.usage.expenseUsed >= sub.limits.expenses &&
        user.usage.emailUsed >= sub.limits.emails
      ) {
        return res.json({
          error: "وصلت حد المصاريف 😅",
        });
      }

      const expense = await Expense.create({
        ...ai,
        userId,
      });

      // 🔥 زيادة الاستخدام فقط
      user.usage.expenseUsed += 1;
      await user.save();

      return res.json({
        speak: "تم تسجيل المصروف",
        data: expense,
        session: null,
      });
    }

    // ⏰ Reminder
    if (ai.type === "reminder") {
      if (
        user.usage.reminderUsed >= sub.limits.reminders &&
        user.usage.emailUsed >= sub.limits.emails
      ) {
        return res.json({
          error: "وصلت حد التذكيرات 😅",
        });
      }

      const reminder = await Remainder.create({
        ...ai,
        userId,
      });

      user.usage.reminderUsed += 1;
      await user.save();

      return res.json({
        speak: "تم إضافة التذكير",
        data: reminder,
        session: null,
      });
    }

    res.status(400).json({ error: "Unknown type" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
