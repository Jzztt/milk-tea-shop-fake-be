import ProductVariant from "../models/ProductVariantModel";

const createVariant = async (req, res) => {
  try {
    const { productId, options, price } = req.body;
    const variant = new ProductVariant({ productId, options, price });
    await variant.save();
    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: variant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const VariantController = { createVariant };
