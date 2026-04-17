import Order from "../modal/order.modal.js";
import Subscription from "../modal/subscription.modal.js";
import paypal from "@paypal/checkout-server-sdk";
import Client from "../../lib/paypal.js";
import dotenv from "dotenv";
dotenv.config();

// 🧠 plan pricing (IMPORTANT)
const PLAN_PRICES = {
  pro: 4.99,
  pro_plus: 9.99,
};

// 🧠 plan limits
const PLAN_LIMITS = {
  pro: {
    reminders: 20,
    emails: 100,
    expenses: 100,
  },
  pro_plus: {
    reminders: 50,
    emails: -1, // unlimited
    expenses: -1, // unlimited
  },
};

// =======================================
// ✅ CREATE ORDER
// =======================================
export const createOrderWithPaypal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan } = req.body;

    // ❗ validate plan
    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const amount = PLAN_PRICES[plan];

    // 1️⃣ create order in DB
    const newOrder = await Order.create({
      userId,
      amount,
      plan,
      status: "pending",
    });

    // 2️⃣ create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.DOMAIN_URL}/api/v1/paypal/success`,
        cancel_url: `${process.env.DOMAIN_URL}/api/v1/paypal/cancel`,
        brand_name: "TrackIt Ai",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    });

    const response = await Client.execute(request);

    // 3️⃣ get approval link
    const approveLink = response.result.links.find(
      (link) => link.rel === "approve",
    );

    if (!approveLink) {
      throw new Error("No approve URL from PayPal");
    }

    // 4️⃣ save PayPal order ID
    newOrder.paypalOrderId = response.result.id;
    await newOrder.save();

    // 5️⃣ send to frontend
    return res.status(200).json({
      id: response.result.id,
      approveUrl: approveLink.href,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Create order failed" });
  }
};

// =======================================
//  CAPTURE ORDER
// =======================================
export const captureOrderWithPaypal = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID required" });
    }

    //  capture payment
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await Client.execute(request);

    const capture = response.result.purchase_units[0].payments.captures[0];

    const paidAmount = parseFloat(capture.amount.value);

    // 2️⃣ get order from DB
    const order = await Order.findOne({ paypalOrderId: orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 3️⃣ verify amount (VERY IMPORTANT 🔥)
    if (paidAmount !== order.amount) {
      return res.status(400).json({ error: "Amount mismatch" });
    }

    // 4️⃣ update order
    order.status = "completed";
    order.paypalPaymentId = capture.id;
    await order.save();

    // 5️⃣ update subscription
    await Subscription.findOneAndUpdate(
      { userId: order.userId },
      {
        $set: {
          plan: order.plan,
          amount: order.amount,
          paymentStatus: "completed",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          limits: PLAN_LIMITS[order.plan],
        },
      },
      { upsert: true, new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Payment successful 🎉",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Capture failed" });
  }
};

export const paypalCancel = async (req, res) => {
  try {
    return res.redirect("trackit://paypal-cancel");
  } catch (error) {
    console.error("PayPal Cancel Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const paypalSuccess = async (req, res) => {
  try {
    const { token } = req.query;
    return res.redirect(`trackit://paypal-success?token=${token}`);
  } catch (error) {
    console.error("PayPal Success Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
