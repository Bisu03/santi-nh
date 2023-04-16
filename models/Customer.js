import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true },
    gender: { type: String },
    contactNo: { type: String },
    address: { type: String },
    age: { type: String },
    medicalCase: { type: String },
    billingStatus: { type: Boolean, default: false },
    dateOfAdd: { type: String },
  },
  { timestamps: true }
);

let Dataset =
  mongoose.models.customer || mongoose.model("customer", customerSchema);
export default Dataset;
