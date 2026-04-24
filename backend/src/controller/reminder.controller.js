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

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    const reminder = await Remainder.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { date: new Date(date) },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    res.status(200).json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await Remainder.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    res.status(200).json({ success: true, message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
