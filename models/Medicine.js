import mongoose from "mongoose";

const Medicine = new mongoose.Schema(
  {
    expiry: { type: String },
    medicineName: { type: String, required: true },
    batchNo: { type: String },
    brand: { type: String },
    costPerStrip: { type: Number, default: 0 },
    costPervial: { type: Number, default: 0 },
    quantity: { type: Number },
    others: {
      type: Object,
    },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.Medicines || mongoose.model("Medicines", Medicine);
export default Dataset;
