/* eslint-disable import/no-anonymous-default-export */
import connectDB from "../../lib/connectDb";
import MedicineBill from "../../models/Medicinebill";
import Addmedicine from "../../models/Medicine";
import { getSession } from "next-auth/react";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        medicineCharges,
        total,
        billingId,
        admissionId,
        admission,
        patient,
      } = req.body;

      // console.log(billingId, admissionId, admission);

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

      await MedicineBill.create({
        billing: billingId,
        patient,
        medicineCharges,
        total,
        admissionId,
        admission,
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
