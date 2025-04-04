import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    status: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Attribute = mongoose.model("Attribute", attributeSchema);
export default Attribute;
