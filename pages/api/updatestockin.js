import { getSession } from "next-auth/react";
import Stock from "../../models/Stockin";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        dlno,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        presentquantity,
        addedquantity,
        total,
        dateOfadd,
      } = req.body || req.query;
      const addesMed = await Stock.findOneAndUpdate(
        { medicineId: req.body.medicineId },
        {
          dlno,
          medicineName,
          batchNo,
          brand,
          costPerStrip,
          costPervial,
          presentquantity,
          addedquantity,
          total,
          dateOfadd,
        }
      );
      console.log(addesMed);
      return res.status(200).json(addesMed);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
