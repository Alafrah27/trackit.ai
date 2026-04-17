import cron from "node-cron";
import Subscription from "../src/modal/subscription.modal.js";

const SubscriptionCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const expireUserSubscription = await Subscription.find({
        plan: { $ne: "free" },
        endDate: { $lt: new Date() },
      });

      for (const sub of expireUserSubscription) {
        sub.plan = "free";
        sub.limits = {
          reminders: 2,
          emails: 10,
          expenses: 10,
        };
        await sub.save();
      }
    } catch (error) {
      console.error("Error in SubscriptionCron:", error);
    }
  });
};

export default SubscriptionCron;
