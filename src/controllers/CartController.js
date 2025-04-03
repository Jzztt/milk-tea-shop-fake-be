import Cart from "../models/CartModel";

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId items.variantId"
    );
    res.status(200).json({
      success: true,
      data: cart || { userId: req.params.userId, items: [] },
      message: "Lay gio hang thanh cong",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { userId, productId, variantId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId?.toString() === variantId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, variantId, quantity });
    }

    await cart.save();
    res.json({ message: "Đã thêm vào giỏ hàng!", data: cart, success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId, variantId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.variantId?.toString() === variantId
        )
    );

    await cart.save();
    res.json({ message: "Đã xóa khỏi giỏ hàng!", data: cart, success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const CartController = { getCart, addToCart, removeFromCart };
