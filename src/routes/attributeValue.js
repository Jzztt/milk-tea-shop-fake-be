import express from "express";
import { AttributeValueController } from "../controllers/attributeValueController";
const attributeValueRouter = express.Router();

attributeValueRouter.post("/", AttributeValueController.createAttributeValue);
attributeValueRouter.get('/', AttributeValueController.getAllAttributeValues);
attributeValueRouter.get('/attribute/:attributeId', AttributeValueController.getAttributeValuesByAttribute);
attributeValueRouter.get('/:id', AttributeValueController.getAttributeValueById);
attributeValueRouter.put('/:id', AttributeValueController.updateAttributeValue);
attributeValueRouter.patch('/:id/status', AttributeValueController.changeAttributeValueStatus);
attributeValueRouter.delete('/:id', AttributeValueController.deleteAttributeValue);

export default attributeValueRouter;