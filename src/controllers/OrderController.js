import AttributeValue from "../models/AttributeValueModel";
import Order from "../models/OrderModel";
import Product from "../models/ProductModel";
import ProductVariant from "../models/ProductVariantModel";
import User from "../models/UserModel";

const createOrder = async (req, res) => {
  try {
    const { items, customerInfo, userId } = req.body;

    let customerDetails = {};
    if (userId) {
      const user = await User.findById(userId);
      if (!user)
        return res.status(400).json({ message: "Người dùng không tồn tại", success: false });
      customerDetails = {
        name: user.name,
        phone: user.phone,
        address: user.address,
      };
    } else if (customerInfo) {
      customerDetails = customerInfo;
    } else {
      return res.status(400).json({ message: "Thiếu thông tin khách hàng", success: false });
    }

    let orderItems = [];

    for (let item of items) {
      const { productId, selectedOptions, quantity } = item;
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Sản phẩm không tồn tại", success: false });

      const validOptions = await AttributeValue.find({
        _id: { $in: selectedOptions },
      });
      if (validOptions.length !== selectedOptions.length) {
        return res.status(400).json({ message: "Tùy chọn không hợp lệ", success: false });
      }

      let price = product.basePrice;
      validOptions.forEach((attr) => {
        price += attr.extraPrice;
      });

      // Lazy Creation
      let existingVariant = await ProductVariant.findOne({
        productId,
        options: selectedOptions.sort(),
      });

      if (!existingVariant) {
        existingVariant = new ProductVariant({
          productId,
          options: selectedOptions,
          price,
        });
        await existingVariant.save();
      }

      orderItems.push({
        productId,
        selectedOptions,
        quantity,
        price,
        variantId: existingVariant._id,
      });
    }

    const newOrder = new Order({
      customerInfo: customerDetails,
      items: orderItems,
      status: "pending",
      userId: userId || null,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Đơn hàng đã được tạo!",
      order: newOrder,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const OrderController = {
  createOrder,
  getOrders,
};
