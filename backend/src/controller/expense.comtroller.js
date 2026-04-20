import Expense from "../modal/expense.modal.js";

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    const expenses = await Expense.find({ userId: userId }).sort({
      createdAt: -1,
    });
    if (!expenses) {
      return res.status(404).json({ message: "No expenses found" });
    }
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.log(error);
  }
};

export const getTotalExpensesAndDailyAverageAndHighestExpense = async (
  req,
  res,
) => {
  try {
    const userId = req.user._id;

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: "$amount",
          },
          dailyAverage: {
            $avg: "$amount",
          },
          highestExpense: {
            $max: "$amount",
          },
        },
      },
    ]);
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.log(error);
  }
};
