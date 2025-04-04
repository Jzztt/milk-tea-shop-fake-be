import mongoose from "mongoose";

const attributeValueSchema = new mongoose.Schema(
  {
    attributeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
    name: String,
    status: { type: Boolean, default: false },
    extraPrice: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

const AttributeValue = mongoose.model("AttributeValue", attributeValueSchema);
export default AttributeValue;
