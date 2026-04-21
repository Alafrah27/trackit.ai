import Expense from "../modal/expense.modal.js";

// Category icon/color mapping for consistent UI rendering
const categoryMeta = {
  housing: { icon: "home-outline", color: "#005bc1" },
  "food & dining": { icon: "fast-food-outline", color: "#3b82f6" },
  food_dining: { icon: "fast-food-outline", color: "#3b82f6" },
  transport: { icon: "car-outline", color: "#60a5fa" },
  shopping: { icon: "cart-outline", color: "#93c5fd" },
  entertainment: { icon: "game-controller-outline", color: "#8b5cf6" },
  health: { icon: "heart-outline", color: "#ef4444" },
  education: { icon: "school-outline", color: "#f59e0b" },
  bills: { icon: "receipt-outline", color: "#10b981" },
  others: { icon: "apps-outline", color: "#6b7280" },
};

const getCategoryMeta = (categoryName) => {
  const key = categoryName?.toLowerCase().trim();
  return categoryMeta[key] || categoryMeta["others"];
};

/**
 * GET /api/v1/insights?month=1&year=2026
 * Returns aggregated expense insights for a given month.
 */
export const getMonthlyInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1; // 1-indexed
    const year = parseInt(req.query.year) || now.getFullYear();

    // Build date range for the requested month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1); // first day of next month

    // ── 1. Total spending ────────────────────────────────────────────
    const totalAgg = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const total = totalAgg.length > 0 ? totalAgg[0].total : 0;

    // ── 2. Weekly chart breakdown (4-5 weeks) ────────────────────────
    const weeklyAgg = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          value: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Pad to at least 4 entries for the chart
    const chart = weeklyAgg.map((w) => w.value);
    while (chart.length < 4) chart.push(0);

    // ── 3. Category breakdown ────────────────────────────────────────
    const categoryAgg = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            en: "$category.en",
            ar: "$category.ar",
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const categories = categoryAgg.map((cat) => {
      const meta = getCategoryMeta(cat._id.en);
      const percent = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
      return {
        title: cat._id, // { en, ar }
        amount: cat.amount,
        percent: `${percent}%`,
        color: meta.color,
        icon: meta.icon,
      };
    });

    // ── 4. Previous month comparison for AI insight ──────────────────
    const prevStart = new Date(year, month - 2, 1);
    const prevEnd = new Date(year, month - 1, 1);

    const prevTotalAgg = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: prevStart, $lt: prevEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const prevTotal = prevTotalAgg.length > 0 ? prevTotalAgg[0].total : 0;
    let changePercent = 0;
    if (prevTotal > 0) {
      changePercent = Math.round(((total - prevTotal) / prevTotal) * 100);
    }

    return res.status(200).json({
      success: true,
      insights: {
        total,
        chart,
        categories,
        comparison: {
          previousMonthTotal: prevTotal,
          changePercent,
          trend: changePercent > 0 ? "up" : changePercent < 0 ? "down" : "stable",
        },
      },
    });
  } catch (error) {
    console.error("Insight controller error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch insights" });
  }
};
