import express from "express";
import { CartController } from "../controllers/CartController";

const cartRouter = express.Router();
cartRouter.get("/cart/:userId", CartController.getCart);
cartRouter.post("/cart", CartController.addToCart);
cartRouter.delete("/cart", CartController.removeFromCart);

export default cartRouter;
