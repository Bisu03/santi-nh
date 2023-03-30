import mongoose from "mongoose";

const Stockin = new mongoose.Schema(
    {
        medicineId: { type: String, required: true,ref: "Medicine", },
        expiry: { type: String, required: true },
        medicineName: { type: String, required: true },
        batchNo: { type: String },
        brand: { type: String },
        costPerStrip: { type: Number, default: 0 },
        costPervial: { type: Number, default: 0 },
        presentquantity: { type: Number, default: 0 },
        addedquantity: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        dateOfadd: { type: String },

    },
    { timestamps: true }
);

let Dataset =
    mongoose.models.Stockin || mongoose.model("Stockin", Stockin);
export default Dataset;