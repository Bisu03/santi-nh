import mongoose from "mongoose";

const spent = new mongoose.Schema(
    {
        itemname: { type: String },
        amount: { type: Number, default: 0 },
        dateOfEnter: { type: String },

    },
    { timestamps: true }
);

let Dataset =
    mongoose.models.spent || mongoose.model("spent", spent);
export default Dataset;