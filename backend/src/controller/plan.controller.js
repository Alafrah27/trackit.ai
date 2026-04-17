import Plan from "../modal/plan.modal.js";
import User from "../modal/user.modal.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createPlan = async (req, res) => {
  try {
    const { amount, description, plan } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newPlan = new Plan({
      userId,
      amount,
      description,
      plan,
    });
    await newPlan.save();
    res.json(newPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
