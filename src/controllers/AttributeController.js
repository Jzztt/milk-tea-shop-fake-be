import Attribute from "../models/AttributeModel";

const createAttribute = async (req, res) => {
  try {
    const { name } = req.body;

    const existingAttribute = await Attribute.findOne({ name });
    if (existingAttribute) {
      return res.status(400).json({
        success: false,
        message: "Attribute with this name already exists",
      });
    }
    const attribute = new Attribute({ name });
    await attribute.save();
    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: attribute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.aggregate([
      {
        $lookup: {
          from: "attributevalues",
          localField: "_id",
          foreignField: "attributeId",
          as: "values",
        },
      },
    ]);

    res.json({
      success: true,
      data: attributes,
      message: "Fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Attribute not found",
      });
    }

    res.status(200).json({
      success: true,
      data: attribute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attribute",
      error: error.message,
    });
  }
};

const updateAttribute = async (req, res) => {
  try {
    const { name, status } = req.body;

    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Attribute not found",
      });
    }

    if (name) attribute.name = name;
    if (status !== undefined) attribute.status = status;

    const updatedAttribute = await attribute.save();

    res.status(200).json({
      success: true,
      data: updatedAttribute,
      message: "Attribute updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating attribute",
      error: error.message,
    });
  }
};

const deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Attribute not found",
      });
    }

    await attribute.deleteOne();

    res.status(200).json({
      success: true,
      message: "Attribute deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting attribute",
      error: error.message,
    });
  }
};

export const AttributeController = {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute
};
