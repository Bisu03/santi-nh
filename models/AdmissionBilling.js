import mongoose from "mongoose";

const admissionBillingSchema = new mongoose.Schema(
  {
    admissionId: { type: String, required: true, unique: true },
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
    accommodationDetails: { type: Object },
    anotheraccomodation: { type: Object },
    serviceCharge: { type: Object },
    diagnosticCharges: { type: Object },
    doctor: { type: Object },
    nursingCharge: { type: Object },
    medicineCharges: { type: Object },
    otCharge: { type: Object },
    otMedicines: { type: Object },
    taxDetails: { type: Object },
    dischargeMedicines: { type: Object },
    specialNeeds: { type: Object },
    ambulationCharge: { type: Number },
    patientSummary: { type: Object },
    admissionSummary: { type: Object },
    total: { type: Object },
    isMedAdd: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.AdmissionBilling ||
  mongoose.model("AdmissionBilling", admissionBillingSchema);
export default Dataset;
