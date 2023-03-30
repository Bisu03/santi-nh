/* eslint-disable import/no-anonymous-default-export */
import { getSession } from "next-auth/react";
import MedicineBill from "../../../models/Medicinebill";
import connectDB from "../../../lib/connectDb";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      let getData = await MedicineBill.findOne({
        admissionId: req.query.findmedbill,
      })
        .populate({
          path: "billing",
        })
        .populate({
          path: "admission",
        })
        .populate({
          path: "patient",
        });
      // console.log(getData);
      return res.status(200).json(getData);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
