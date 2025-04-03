import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", default: null },
      quantity: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
