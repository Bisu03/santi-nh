import { getSession } from "next-auth/react";
import Admission from "../../../models/Admission";
import connectDB from "../../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const admissionData = await Admission.findOne({
        admissionId: req.query.admissionid,
        isDeleted: false,
      }).populate({
        path: "patient",
      });

      console.log(req.query.admissionid);

      let admission;

      if (admissionData?.billingDone === true) {
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
        admission = admissionData;
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
