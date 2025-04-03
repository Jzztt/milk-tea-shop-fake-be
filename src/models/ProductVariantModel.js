  import mongoose from "mongoose";

  const ProductVariantSchema = new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      options: [{ type: mongoose.Schema.Types.ObjectId, ref: "AttributeValue" }],
      price: { type: Number, required: true },
      stock: { type: Number, default: 0 },
      sku: { type: String, unique: true },
    },
    { timestamps: true,   versionKey: false, }
  );

  const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);

  export default ProductVariant;
