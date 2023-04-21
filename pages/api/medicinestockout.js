import { getSession } from "next-auth/react";
import Admission from "../../models/Admission";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });
    if (session) {
      const getMed = await Admission.find({
        dateOfDeparture: { $gte: req.query.fromdate, $lte: req.query.todate },
        billingDone: true,
      })
        .populate({
          path: "patient",
        })
        .populate({
          path: "billing",
        })
        .sort({
          createdAt: -1,
        })
      return res.status(200).json(getMed);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
