import Attribute from "../models/AttributeModel";
import AttributeValue from "../models/AttributeValueModel";
import Product from "../models/ProductModel";
import ProductVariant from "../models/ProductVariantModel";

const generateSKU = (productName, options, attributeValues) => {
  const cleanName = productName.toUpperCase().replace(/\s+/g, "-");
  const optionNames = attributeValues.map((opt) =>
    opt.name.toUpperCase().replace(/\s+/g, "-")
  );
  return `${cleanName}-${optionNames.join("-")}`;
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
  let savedProduct = null;

  try {
    const {
      name,
      description,
      category,
      basePrice,
      salePrice,
      imageUrl,
      status,
      attributes,
      predefinedVariants,
    } = req.body;

    if (!name || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Name and basePrice are required",
      });
    }

    if (basePrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Base price cannot be negative",
      });
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    if (attributes && attributes.length > 0) {
      const validAttributes = await Attribute.find({
        _id: { $in: attributes },
        status: true,
      });

      if (validAttributes.length !== attributes.length) {
        return res.status(400).json({
          success: false,
          message: "One or more attributes are invalid or inactive",
        });
      }
    }

    if (imageUrl) {
      const imageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/;
      if (!imageRegex.test(imageUrl)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image URL format. Must be jpg, jpeg, png, or gif",
        });
      }
    }

    const newProduct = new Product({
      name,
      description,
      category,
      basePrice,
      salePrice,
      image: imageUrl,
      status: status !== undefined ? status : false,
      attributes: attributes || [],
    });

    savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);

    let createdVariants = [];
    if (predefinedVariants && predefinedVariants.length > 0) {
      for (const variant of predefinedVariants) {
        const { options, stock } = variant;

        if (!options) {
          await Product.findByIdAndDelete(savedProduct._id);
          return res.status(400).json({
            success: false,
            message: "Each variant must have options",
          });
        }

        if (stock !== undefined && stock < 0) {
          await Product.findByIdAndDelete(savedProduct._id);
          return res.status(400).json({
            success: false,
            message: "Variant stock cannot be negative",
          });
        }

        const validOptions = await AttributeValue.find({
          _id: { $in: options },
          status: true,
        });

        if (validOptions.length !== options.length) {
          await Product.findByIdAndDelete(savedProduct._id);
          return res.status(400).json({
            success: false,
            message: "Một hoặc nhiều tùy chọn của biến thể không hợp lệ hoặc không hoạt động",
          });
        }

        const attributeIds = validOptions.map((opt) => opt.attributeId.toString());
        const productAttributeIds = (attributes || []).map((id) => id.toString());
        console.log("attributeIds từ options:", attributeIds);
        console.log("productAttributeIds từ attributes:", productAttributeIds);
        const allOptionsValid = attributeIds.every((id) => productAttributeIds.includes(id));
        if (!allOptionsValid) {
          console.log("Các attributeId không hợp lệ:", attributeIds.filter((id) => !productAttributeIds.includes(id)));
          await Product.findByIdAndDelete(savedProduct._id);
          return res.status(400).json({
            success: false,
            message: "Variant options must belong to product attributes",
          });
        }

        const totalExtraPrice = validOptions.reduce(
          (sum, opt) => sum + (opt.extraPrice || 0),
          0
        );
        const variantPrice = basePrice + totalExtraPrice;

        const sku = generateSKU(name, options, validOptions);

        const existingVariant = await ProductVariant.findOne({ sku });
        if (existingVariant) {
          await Product.findByIdAndDelete(savedProduct._id);
          return res.status(400).json({
            success: false,
            message: `Generated SKU ${sku} already exists`,
          });
        }

        const newVariant = new ProductVariant({
          productId: savedProduct._id,
          options,
          price: variantPrice,
          stock: stock || 0,
          sku,
          status: true,
        });

        const savedVariant = await newVariant.save();
        createdVariants.push(savedVariant);
      }
    }

    const populatedProduct = await Product.findById(savedProduct._id).populate(
      "attributes",
      "name"
    );

    res.status(201).json({
      success: true,
      data: {
        product: populatedProduct,
        variants: createdVariants,
      },
      message: "Product and predefined variants created successfully",
    });
  } catch (error) {
    if (savedProduct) {
      await Product.findByIdAndDelete(savedProduct._id);
    }
    res.status(500).json({
      success: false,
      message: "Error creating product and variants",
      error: error.message,
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
