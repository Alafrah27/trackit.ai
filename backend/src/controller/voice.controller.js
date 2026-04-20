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
    if (!user) {
      return res.json({ error: "User not found" });
    }

    let sub = await Subscription.findOne({ userId });

    if (!sub) {
      sub = await Subscription.create({
        userId,
        plan: "free",
        limits: {
          reminders: 2,
          emails: 10,
          expenses: 10,
        },
      });
    }

    const ai = await processVoice(text, session);

    if (!ai || !ai.type) {
      return res.status(400).json({ error: "AI failed" });
    }

    // ❓ Question
    if (ai.type === "question") {
      return res.json({
        speak: ai.question,
        session: ai.session,
      });
    }

    // 💸 Expense
    if (ai.type === "expense") {
      if (user.usage.expenseUsed >= sub.limits.expenses) {
        return res.json({ error: "وصلت حد المصاريف 😅" });
      }

      const expense = await Expense.create({
        ...ai,
        userId,
      });

      user.usage.expenseUsed += 1;
      await user.save();

      return res.json({
        speak: `عزيزي ${user.name} ، تم إضافة المصروف بنجاح!\nDear ${user.name} 😊, your expense has been added successfully!`,
        data: expense,
        session: null,
      });
    }

    // ⏰ Reminder
    if (ai.type === "reminder") {
      if (user.usage.reminderUsed >= sub.limits.reminders) {
        return res.json({ error: "وصلت حد التذكيرات 😅" });
      }

      const reminder = await Remainder.create({
        ...ai,
        userId,
      });

      user.usage.reminderUsed += 1;
      await user.save();

      return res.json({
        speak: `عزيزي ${user.name} ، تم إضافة التذكير بنجاح، لا تقلق سنذكرك في الوقت المناسب!\nDear ${user.name} 😊, your reminder has been added successfully. Don’t worry, we will remind you at the right time!`,
        data: reminder,
        session: null,
      });
    }

    return res.status(400).json({ error: "Unknown type" });
  } catch (err) {
    console.error("VOICE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};
