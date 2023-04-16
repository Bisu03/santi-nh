import mongoose from "mongoose";

const customermedicineSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    medicineCharges: { type: Object },
    isMedAdd: { type: Boolean, default: false },
    total: { type: Object },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.customermedicinebill ||
  mongoose.model("customermedicinebill", customermedicineSchema);
export default Dataset;
