import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: "AttributeValue" }],
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, unique: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);
ProductVariantSchema.index({ productId: 1 });
const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);

export default ProductVariant;
