import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: String,
    basePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: 0, min: 0 },
    image: {
      type: String,
      match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/
    },
    status: { type: Boolean, default: false },
    attributes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attribute" }],
  },
  { timestamps: true,  versionKey: false }
);

ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
