import { getSession } from "next-auth/react";
import Fileupload from "../../models/Fileupload";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });
    if (session) {
      console.log(req.query);
      try {
        const data = await Fileupload.find({
          admissionId: req.query.search
        }).sort({
          createdAt: -1,
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
