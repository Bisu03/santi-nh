/* eslint-disable import/no-anonymous-default-export */
import { getSession } from "next-auth/react";
import Addmedicine from "../../models/Medicine";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        quantity,
      } = req.body;
      console.log(req.body);
      if (!expiry || !medicineName) {
        return res.status(401).json({ message: "please fill all fields" });
      }

      const addesMed = await Addmedicine.create({
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        quantity,
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
