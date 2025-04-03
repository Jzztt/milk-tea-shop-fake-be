import AttributeValue from "../models/AttributeValueModel";
import Product from "../models/ProductModel";
import ProductVariant from "../models/ProductVariantModel";


const generateSKU = async (productName, selectedOptions) => {
  const optionValues = await AttributeValue.find({ _id: { $in: selectedOptions } });
  const optionString = optionValues.map((opt) => opt.name).join("-");
  return `${productName.toUpperCase().replace(/\s/g, "-")}-${optionString || "DEFAULT"}`;
};
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    if (!products.length) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    res
      .status(200)
      .json({ success: true, data: products, message: "Fetched successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ message: "No product found", success: false });

    let variants = [];
    if (product.hasVariants) {
      variants = await ProductVariant.find({ productId: product._id });
    }

    res.json({
      data: { ...product.toObject(), variants },
      success: true,
      message: "Fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      image,
      status,
      attributes,
      predefinedVariants,
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      category,
      basePrice,
      image,
      status,
      attributes,
    });
    await newProduct.save();

    let createdVariants = [];
    if (predefinedVariants && predefinedVariants.length > 0) {
      const variantPromises = predefinedVariants.map(async (variant) => {
        const { selectedOptions, price, stock } = variant;

        // Kiểm tra tính hợp lệ của selectedOptions
        const validOptions = await AttributeValue.find({
          _id: { $in: selectedOptions },
        });
        if (validOptions.length !== selectedOptions.length) {
          throw new Error("Tùy chọn không hợp lệ");
        }

        // Tính giá nếu không có price từ frontend
        const finalPrice = price || basePrice + validOptions.reduce((sum, attr) => sum + (attr.extraPrice || 0), 0);

        // Tự sinh SKU
        const sku = await generateSKU(name, selectedOptions);

        const newVariant = new ProductVariant({
          productId: newProduct._id,
          options: selectedOptions,
          price: finalPrice,
          stock: stock || 0, // Mặc định stock = 0 nếu không có
          sku,
        });
        return newVariant.save();
      });

      createdVariants = await Promise.all(variantPromises);
    }

    res.status(201).json({
      message: "Sản phẩm đã được tạo!",
      product: newProduct,
      variants: createdVariants,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, category, basePrice, image } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, category, basePrice, image },
      { new: true }
    );

    if (!product)
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại", success: false });

    res.json({
      message: "Cập nhật sản phẩm thành công!",
      data: product,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await ProductVariant.deleteMany({ productId: req.params.id });
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    res.json({ message: "Sản phẩm đã được xóa!", success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const ProductController = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
