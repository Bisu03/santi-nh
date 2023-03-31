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
        fullname,
        admissionId,
        gender,
        age,
        contactNo,
        aadharNo,
        address,
        guardianName,
        guardianContactNo,
        medicalCase,
        drrefferal,
        dateOfAdmission,
        admissioncharge,
        specialNeeds,
        doctor,
        diagnosticCharges,
      } = req.body;

      const newPatient = await Patient.create({
        admissionId,
        fullname,
        gender,
        contactNo,
        aadharNo,
        address,
      });

      if (newPatient) {
        const Patientadmission = await Admission.create({
          admissionId,
          patient: newPatient._id,
          age,
          guardianName,
          guardianContactNo,
          drrefferal,
          medicalCase,
          dateOfAdmission,
          admissioncharge,
        });

        const billing = await AdmissionBilling.create({
          admissionId,
          admission: Patientadmission._id,
          specialNeeds,
          doctor,
          diagnosticCharges,
        });
        if (billing) {
          await Admission.findByIdAndUpdate(Patientadmission._id, {
            billing: billing._id,
            billingDone: true,
          });
        }
      }

      res.status(201).json({
        message: `Patient admitted successfully, Admission Id: ${admissionId}`,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
