import Attribute from "../models/AttributeModel";

const createAttribute = async (req, res) => {
  try {
    const { name } = req.body;
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

export const AttributeController = { createAttribute, getAllAttributes };
