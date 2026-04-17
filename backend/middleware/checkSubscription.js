import Subscription from "../src/modal/subscription.modal.js";

const checkSubScription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ userId: req.user._id });
    if (!sub) return next();
    if (sub.startDate && sub.endDate < new Date()) {
      sub.plan = "free";
      sub.limits = {
        reminders: 2,
        emails: 10,
        expenses: 10,
      };
      await sub.save();
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default checkSubScription;


// ─── Check Subscription Middleware ───────────────────────────────────────────────
// This middleware checks if the user has an active subscription and if not, 
// it downgrades them to a free plan with default limits.
// It also handles the case where the subscription has expired.
// ───────────────────────────────────────────────────────────────────────────────
