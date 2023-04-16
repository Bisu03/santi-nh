/* eslint-disable import/no-anonymous-default-export */
import { getSession } from "next-auth/react";
import connectDB from "../../../lib/connectDb";
import Customer from "../../../models/Customer";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        fullname,
        gender,
        age,
        contactNo,
        address,
        medicalCase,
        dateOfAdd,
      } = req.body;

      let getData;
      getData = await Customer.findByIdAndUpdate(
        req.query.editcustomer,

        {
          fullname,
          gender,
          age,
          contactNo,
          address,
          medicalCase,
          dateOfAdd,
        }
      );
      return res.status(200).json(getData);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
