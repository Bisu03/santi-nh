import { getSession } from "next-auth/react";
import Stock from "../../models/Stockin";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        medicineId,
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        presentquantity,
        addedquantity,
        total,
        dateOfadd,
      } = req.body;
      if (!expiry || !medicineName) {
        return res.status(401).json({ message: "please fill all fields" });
      }

      const addesMed = await Stock.create({
        medicineId,
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        presentquantity,
        addedquantity,
        total,
        dateOfadd,
      });

      return res.status(200).json(addesMed);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
