import AttributeValue from "../models/AttributeValueModel";

const createAttributeValue = async (req, res) => {
  try {
    const { attributeId, name, extraPrice, status } = req.body;

    const attribute = await Attribute.findById(attributeId);
    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Attribute not found",
      });
    }

    const existingValue = await AttributeValue.findOne({
      attributeId,
      name,
    });
    if (existingValue) {
      return res.status(400).json({
        success: false,
        message: "Attribute value already exists for this attribute",
      });
    }

    const newAttributeValue = new AttributeValue({
      attributeId,
      name,
      extraPrice,
      status: status !== undefined ? status : true
    });

    const savedAttributeValue = await newAttributeValue.save();
    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: savedAttributeValue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllAttributeValues = async (req, res) => {
  try {
    const attributeValues = await AttributeValue.find()
      .populate("attributeId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attributeValues.length,
      data: attributeValues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attribute values",
      error: error.message,
    });
  }
};

const getAttributeValuesByAttribute = async (req, res) => {
  try {
    const attributeValues = await AttributeValue.find({
      attributeId: req.params.attributeId,
    })
      .populate("attributeId", "name")
      .sort({ createdAt: -1 });

    if (!attributeValues.length) {
      return res.status(404).json({
        success: false,
        message: "No attribute values found for this attribute",
      });
    }

    res.status(200).json({
      success: true,
      count: attributeValues.length,
      data: attributeValues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attribute values",
      error: error.message,
    });
  }
};

const getAttributeValueById = async (req, res) => {
  try {
    const attributeValue = await AttributeValue.findById(
      req.params.id
    ).populate("attributeId", "name");

    if (!attributeValue) {
      return res.status(404).json({
        success: false,
        message: "Attribute value not found",
      });
    }

    res.status(200).json({
      success: true,
      data: attributeValue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attribute value",
      error: error.message,
    });
  }
};

const updateAttributeValue = async (req, res) => {
  try {
    const { name, extraPrice, status } = req.body;

    const attributeValue = await AttributeValue.findById(req.params.id);

    if (!attributeValue) {
      return res.status(404).json({
        success: false,
        message: "Attribute value not found",
      });
    }

    if (name) attributeValue.name = name;
    if (extraPrice !== undefined) attributeValue.extraPrice = extraPrice;
    if (status !== undefined) attributeValue.status = status;

    const updatedAttributeValue = await attributeValue.save();

    res.status(200).json({
      success: true,
      data: updatedAttributeValue,
      message: "Attribute value updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating attribute value",
      error: error.message,
    });
  }
};

const deleteAttributeValue = async (req, res) => {
  try {
    const attributeValue = await AttributeValue.findById(req.params.id);

    if (!attributeValue) {
      return res.status(404).json({
        success: false,
        message: "Attribute value not found",
      });
    }

    await attributeValue.deleteOne();

    res.status(200).json({
      success: true,
      message: "Attribute value deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting attribute value",
      error: error.message,
    });
  }
};


const changeAttributeValueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Status must be a boolean value'
      });
    }

    const attributeValue = await AttributeValue.findById(req.params.id);

    if (!attributeValue) {
      return res.status(404).json({
        success: false,
        message: 'Attribute value not found'
      });
    }

    attributeValue.status = status;
    const updatedAttributeValue = await attributeValue.save();

    res.status(200).json({
      success: true,
      data: updatedAttributeValue,
      message: `Attribute value status changed to ${status ? 'active' : 'inactive'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing attribute value status',
      error: error.message
    });
  }
};

export const AttributeValueController = {
  createAttributeValue,
  getAllAttributeValues,
  getAttributeValuesByAttribute,
  getAttributeValueById,
  updateAttributeValue,
  deleteAttributeValue,
  changeAttributeValueStatus,
};
