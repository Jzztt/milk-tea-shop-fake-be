import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        selectedOptions: [
          { type: mongoose.Schema.Types.ObjectId, ref: "AttributeValue" },
        ],
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "canceled"],
      default: "pending",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
