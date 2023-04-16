/* eslint-disable import/no-anonymous-default-export */
import connectDB from "../../lib/connectDb";
import { getSession } from "next-auth/react";
import Customer from "../../models/Customer";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        fullname,
        uniqueId,
        gender,
        contactNo,
        address,
        age,
        medicalCase,
        dateOfAdd,
      } = req.body;

      await Customer.create({
        fullname,
        uniqueId,
        gender,
        contactNo,
        address,
        age,
        medicalCase,
        dateOfAdd,
      });

      res.status(201).json({
        message: `Customer added successfully, Unique ID: ${uniqueId}`,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
