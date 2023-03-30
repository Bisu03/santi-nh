import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    admissionId: { type: String, required: true, unique: true },
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    billing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdmissionBilling",
    },
    medicineCharges: { type: Object },
    isMedAdd: { type: Boolean, default: false },
    total: { type: Object },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.medicinebill ||
  mongoose.model("medicinebill", medicineSchema);
export default Dataset;