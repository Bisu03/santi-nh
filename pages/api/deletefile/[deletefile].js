import { getSession } from "next-auth/react";
import Fileupload from "../../../models/Fileupload";
import connectDB from "../../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });
    if (session) {
      try {
        const data = await Fileupload.findByIdAndDelete({
          _id: req.query.deletefile,
        });
        res.json(data);
      } catch (error) {
        return res.status(401).json({ message: "something went wrong" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
