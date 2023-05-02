import { getSession } from "next-auth/react";
import Fileupload from "../../models/Fileupload";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });
    if (session) {
      const { name, url, admissionId } = req.body;

      try {
        const data = await Fileupload.create({
          name,
          url,
          admissionId,
        });
        console.log(data);
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
