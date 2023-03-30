import { getSession } from "next-auth/react";
import Admission from "../../../models/Admission";
import connectDB from "../../../lib/connectDb";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session?.user?.isSuperAdmin) {
      await Admission.findOneAndDelete({ admissionId: req.query.admissionid });

      return res.status(200).json("Admission record deleted successfully");
    } else {
      return res.status(401).json({ message: "Not allowed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
