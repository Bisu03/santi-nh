import connectDB from "../../lib/connectDb";
import Patient from "../../models/Patient";
import Admission from "../../models/Admission";
import AdmissionBilling from "../../models/AdmissionBilling";
import { getSession } from "next-auth/react";

connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });

    if (session) {
      const {
        patientId,
        patientDetails,
        admissionId,
        billingDone,
        accomodation,
        anotheraccomodation,
        diagnosticCharges,
        serviceCharge,
        doctor,
        nursingCharge,
        medicineCharges,
        otDetails,
        taxDetails,
        otMedicines,
        dischargeMedicines,
        specialNeeds,
        patientSummary,
        admissionSummary,
        ambulationCharge,
        total,
        billingStatus,
      } = req.body;

      const {
        admission,
        fullname,
        gender,
        age,
        contactNo,
        aadharNo,
        address,
        medicalCase,
        guardianName,
        guardianContactNo,
        drrefferal,
        dateOfAdmission,
        dateOfDeparture,
        admissioncharge,
        admissiontype,
      } = patientDetails;

      await Patient.findByIdAndUpdate(patientId, {
        fullname,
        gender,
        contactNo,
        aadharNo,
        address,
      });

      await Admission.findByIdAndUpdate(admission, {
        age,
        guardianName,
        guardianContactNo,
        drrefferal,
        medicalCase,
        dateOfAdmission,
        dateOfDeparture,
        admissioncharge,
        admissiontype,
        billingStatus: billingStatus,
      });


      if (billingDone) {
        await AdmissionBilling.findOneAndUpdate(
          { admissionId: admissionId },
          {
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
          }
        );
      }

      res.status(201).json({
        message: `Record updated successfully`,
      });
    } else {
      return res.status(401).json({ message: "Not allowed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
