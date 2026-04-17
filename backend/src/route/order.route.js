import express from "express";
import {
  createOrderWithPaypal,
  captureOrderWithPaypal,
  paypalCancel,
  paypalSuccess,
} from "../controller/order.controller.js";
import { verifyJWT } from "../../middleware/jwtAuth.js";
const router = express.Router();

router.post("/create-order", verifyJWT, createOrderWithPaypal);
router.post("/capture-order", verifyJWT, captureOrderWithPaypal);
router.get("/cancel", paypalCancel);
router.get("/success", paypalSuccess);

export default router;
