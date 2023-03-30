import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    admissionId: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    contactNo: { type: String, required: true },
    aadharNo: { type: String },
    address: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
export default Dataset;
