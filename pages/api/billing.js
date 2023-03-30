import connectDB from "../../lib/connectDb";
import AdmissionBilling from "../../models/AdmissionBilling";
import Admission from "../../models/Admission";
import { getSession } from "next-auth/react";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        admissionId,
        admission,
        accomodation,
        anotheraccomodation,
        diagnosticCharges,
        serviceCharge,
        doctor,
        nursingCharge,
        medicineCharges,
        otDetails,
        taxDetails,
        dischargeMedicines,
        specialNeeds,
        ambulationCharge,
        patientSummary,
        admissionSummary,
        total,
        billingStatus,
        dateOfDeparture,
      } = req.body;

      const newBilling = new AdmissionBilling({
        admissionId,
        admission,
        accommodationDetails: accomodation,
        anotheraccomodation,
        diagnosticCharges,
        serviceCharge,
        doctor,
        nursingCharge,
        medicineCharges,
        otCharge: otDetails,
        taxDetails,
        dischargeMedicines,
        specialNeeds,
        ambulationCharge,
        patientSummary,
        admissionSummary,
        total,
      });
      await newBilling.save();

      await Admission.findByIdAndUpdate(admission, {
        billing: newBilling._id,
        billingDone: true,
        billingStatus: billingStatus,
        dateOfDeparture: dateOfDeparture,
      });

      // if (medicineCharges.items) {
      //   for (let index = 0; index < medicineCharges.items.length; index++) {
      //     const element = medicineCharges.items[index];
      //     console.log(index);
      //     const getdata = await Addmedicine.findByIdAndUpdate(element.id, { $inc: { quantity: -element.quantity } }, { new: true });
      //     console.log(getdata);
      //   }
      // }

      // if (dischargeMedicines.items) {
      //   for (let index = 0; index < dischargeMedicines.items.length; index++) {
      //     const element = dischargeMedicines.items[index];
      //     console.log(index);
      //     const getdata = await Addmedicine.findByIdAndUpdate(element.id, { $inc: { quantity: -element.quantity } }, { new: true });
      //     console.log(getdata);
      //   }
      // }

      res.status(201).json({
        message: `Billing saved successfully`,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
