import connectDB from "../../../lib/connectDb";
import Medicinebillindividual from "../../../models/MedicineBillIndividual";
import Customer from "../../../models/Customer";
import { getSession } from "next-auth/react";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const { id } = req.body;
      await Medicinebillindividual.findOneAndDelete({
        customerId: req.query.deletecustomer,
      });
      await Customer.findByIdAndDelete(req.query.deletecustomer);
    }

    res.status(201).json({
      message: `Record Update successfully`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
