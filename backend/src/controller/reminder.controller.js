import Remainder from "../modal/remainder.modal.js";

export const getAllReminders = async (req, res) => {
  try {
    const userId = req.user._id;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const reminders = await Remainder.find({
      userId: userId,
      isCompleted: false,
    }).sort({ date: 1 });
    res.status(200).json({
      success: true,
      reminders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
