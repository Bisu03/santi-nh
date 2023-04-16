/* eslint-disable import/no-anonymous-default-export */
import { getSession } from "next-auth/react";
import connectDB from "../../../lib/connectDb";
import Customer from "../../../models/Customer";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      let getData;
      getData = await Customer.findById({
        _id: req.query.findcustomer,
      });

      return res.status(200).json(getData);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};