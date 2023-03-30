/* eslint-disable import/no-anonymous-default-export */
import { getSession } from "next-auth/react";
import Addmedicine from "../../models/Medicine";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const keyword = req.query.search
        ? {
            $or: [
              { batchNo: { $regex: req.query.search, $options: "i" } },
              { medicineName: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};
      const getMed = await Addmedicine.find(keyword)
        .sort({
          createdAt: -1,
        })
        .limit(100);
      return res.status(200).json(getMed);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
