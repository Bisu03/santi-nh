import mongoose from "mongoose";
import Patient from "./Patient";
// import AdmissionBilling from "./AdmissionBilling";

const admissionSchema = new mongoose.Schema(
  {
    admissionId: { type: String, required: true, unique: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    age: { type: Number, required: true },
    billing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdmissionBilling",
    },
    medicalCase: { type: String },
    guardianName: { type: String },
    admissiontype: { type: String },
    guardianContactNo: { type: String },
    drrefferal: { type: String },
    admissioncharge: { type: String },
    dateOfAdmission: { type: String },
    dateOfDeparture: { type: String },
    billingDone: { type: Boolean, default: false },
    billingStatus: { type: String },
    paymentDone: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.Admission || mongoose.model("Admission", admissionSchema);
export default Dataset;
