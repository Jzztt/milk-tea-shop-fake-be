import express from "express";
import { AttributeController } from "../controllers/AttributeController";
const attributeRouter = express.Router();

attributeRouter.post("/", AttributeController.createAttribute);
attributeRouter.get("/", AttributeController.getAllAttributes);
attributeRouter.get("/:id", AttributeController.getAttributeById);
attributeRouter.put("/:id", AttributeController.updateAttribute);
attributeRouter.delete("/:id", AttributeController.deleteAttribute);

export default attributeRouter;
