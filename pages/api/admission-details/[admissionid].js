import { getSession } from "next-auth/react";
import Admission from "../../../models/Admission";
import connectDB from "../../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const admissiondata = await Admission.findOne({
        admissionId: req.query.admissionid,
        isDeleted: false,
      }).populate({
        path: "patient",
      });

      let admission;
      console.log(admissiondata.billingDone);

      if (admissiondata.billingDone === true) {
        admission = await Admission.findOne({
          admissionId: req.query.admissionid,
          isDeleted: false,
        })
          .populate({
            path: "patient",
          })
          .populate({
            path: "billing",
          });
      } else {
        admission = admissiondata;
      }

      return res.status(200).json(admission);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
