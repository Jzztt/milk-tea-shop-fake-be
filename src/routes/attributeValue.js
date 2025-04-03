import express from "express";
import { AttributeValueController } from "../controllers/attributeValueController";
const attributeValueRouter = express.Router();

attributeValueRouter.post("/", AttributeValueController.createAttributeValue);

export default attributeValueRouter;