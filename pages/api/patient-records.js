import { getSession } from "next-auth/react";
import Admission from "../../models/Admission";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const keyword = req.query.search
        ? {
            $or: [{ admissionId: { $regex: req.query.search, $options: "i" } }],
            // $or: [{ fullname: { $regex: req.query.search, $options: "i" } }],
          }
        : {};

      let admissions = await Admission.find(keyword)
        .populate({
          path: "patient",
        })
        .lean()
        .sort("-dateOfAdmission");
      // .limit(50);
      return res.status(200).json(admissions);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
