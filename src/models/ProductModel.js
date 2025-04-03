import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: String,
    basePrice: Number,
    image: String,
    status: { type: Boolean, default: false },
    attributes: [{ type: String }],
  },
  { timestamps: true,  versionKey: false }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
