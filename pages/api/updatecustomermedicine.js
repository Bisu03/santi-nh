/* eslint-disable import/no-anonymous-default-export */
import connectDB from "../../lib/connectDb";
import Medicinebillindividual from "../../models/MedicineBillIndividual";
import { getSession } from "next-auth/react";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const { id, medicineCharges, total } = req.body;

      await Medicinebillindividual.findByIdAndUpdate(id, {
        total,
        medicineCharges,
      });
    }

    res.status(201).json({
      message: `Record Update successfully`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};