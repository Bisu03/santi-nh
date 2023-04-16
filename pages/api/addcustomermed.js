/* eslint-disable import/no-anonymous-default-export */
import connectDB from "../../lib/connectDb";
import Medicinebillindividual from "../../models/MedicineBillIndividual";
import Addmedicine from "../../models/Medicine";
import { getSession } from "next-auth/react";
import Customer from "../../models/Customer";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const { customerId, medicineCharges, total } = req.body;

      let key = Object?.keys(medicineCharges?.items);
      for (let index = 0; index < key.length; index++) {
        const element = medicineCharges?.items[key[index]];

        if (element.id.length < 6) {
          continue;
        }

        await Addmedicine.findByIdAndUpdate(
          element.id,
          { $inc: { quantity: -element.quantity } },
          { new: true }
        );
      }

      await Customer.findByIdAndUpdate(customerId, {
        billingStatus: true,
      });
      await Medicinebillindividual.create({
        customerId,
        medicineCharges,
        total,
        isMedAdd: true,
      });
    }

    res.status(201).json({
      message: `Record Added successfully`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
