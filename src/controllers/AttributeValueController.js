import AttributeValue from "../models/AttributeValueModel";

const createAttributeValue = async (req, res) => {
  try {
    const { attributeId, name, extraPrice } = req.body;
    const attributeValue = new AttributeValue({
      attributeId,
      name,
      extraPrice,
    });
    await attributeValue.save();
    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: attributeValue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const AttributeValueController = { createAttributeValue };
