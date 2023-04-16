import { getSession } from "next-auth/react";
import Customer from "../../models/Customer";
import connectDB from "../../lib/connectDb";

connectDB();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const keyword = req.query.search
        ? {
            $or: [{ uniqueId: { $regex: req.query.search, $options: "i" } }],
          }
        : {};

      let customer = await Customer.find(keyword)
        .sort({
          createdAt: -1,
        })
        .limit(50);

      return res.status(200).json(customer);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
