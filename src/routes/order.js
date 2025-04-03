import express from "express";
import { OrderController } from "../controllers/OrderController";
const orderRouter = express.Router();

orderRouter.post("/", OrderController.createOrder);

export default orderRouter;