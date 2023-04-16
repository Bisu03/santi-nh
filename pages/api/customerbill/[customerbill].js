/* eslint-disable import/no-anonymous-default-export */
import { getSession } from "next-auth/react";
import Medicinebillindividual from "../../../models/MedicineBillIndividual";
import connectDB from "../../../lib/connectDb";
import Customer from "../../../models/Customer";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      let getData = await Customer.findById(req.query.customerbill);

      let customerData;

      if (getData.billingStatus === true) {
        customerData = await Medicinebillindividual.findOne({
          customerId: req.query.customerbill,
        }).populate({
          path: "customerId",
        });
      } else {
        customerData = getData;
      }
      // console.log(getData.billingStatus);
      return res.status(200).json(customerData);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
