import express from "express";
import { AttributeController } from "../controllers/attributeController";
const attributeRouter = express.Router();

attributeRouter.post("/", AttributeController.createAttribute)
attributeRouter.get("/", AttributeController.getAllAttributes)



export default attributeRouter;
