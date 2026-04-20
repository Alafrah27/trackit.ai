import { Router } from "express";
import {
  getExpenses,
  getTotalExpensesAndDailyAverageAndHighestExpense,
} from "../controller/expense.comtroller.js";
import { verifyJWT } from "../../middleware/jwtAuth.js";

const router = Router();

router.get("/get-expenses", verifyJWT, getExpenses);
router.get(
  "/get-total-expenses",
  verifyJWT,
  getTotalExpensesAndDailyAverageAndHighestExpense,
);

export default router;
