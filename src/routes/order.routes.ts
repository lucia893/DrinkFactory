import { Router } from "express";
import { postOrder } from "../controllers/order.controller";

const router = Router();
router.post("/order-drink", postOrder);

export default router;
