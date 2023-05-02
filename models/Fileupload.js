import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        admissionId: {
            type: String, required: true
        },
        url: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    { timestamps: true }
);

let Dataset = mongoose.models.files || mongoose.model("files", userSchema);
export default Dataset;
