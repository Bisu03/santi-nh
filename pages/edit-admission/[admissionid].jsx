import React, { useEffect, useState } from "react";
import DiagnosticInput from "../../components/DiagnosticInput";
import Doctorinputes from "../../components/Doctorinputes";
import Heading from "../../components/Heading";
import Navbar from "../../components/Navbar";
import SpecialNeedsInput from "../../components/SpecialNeedsInput";
import Router, { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { getSession } from "next-auth/react";
import LodingScreen from "../../components/LodingScreen";

const EditAdmission = () => {
  const router = useRouter();
  const { admissionid } = router.query;
  const [admissionData, setAdmissionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});
  const [accomodation, setAccomodation] = useState({});
  const [diagnosticCharges, setDiagnosticCharges] = useState({});
  const [serviceCharge, setServiceCharge] = useState({});
  const [doctor, setDoctor] = useState({});
  const [nursingCharge, setNursingCharge] = useState({});
  const [medicineCharges, setMedicineCharges] = useState({});
  const [otDetails, setOtDetails] = useState({});
  const [otMedicines, setOtMedicines] = useState({});
  const [taxDetails, setTaxDetails] = useState({});
  const [dischargeMedicines, setDischargeMedicines] = useState({});
  const [specialNeeds, setSpecialNeeds] = useState({});
  const [ambulationCharge, setAmbulationCharge] = useState("");
  const [patientSummary, setPatientSummary] = useState({});
  const [admissionSummary, setAdmissionSummary] = useState({});
  const [anotheraccomodation, setanotherAccomodation] = useState({});
  const [total, setTotal] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [billingStatus, setBillingStatus] = useState("");
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    const fetchDetailsByAdmissionID = () => {
      setLoading(true);
      axios
        .get(`/api/admission-details/${admissionid}`)
        .then(({ data }) => {
          console.log(data);

          setAdmissionData(data);

          setPatientDetails({
            admissionId: data?.admissionId,
            fullname: data?.patient?.fullname,
            admission: data?._id,
            nhId: data?.nhId,
            gender: data?.patient?.gender,
            age: data?.age,
            address: data?.patient?.address,
            contactNo: data?.patient?.contactNo,
            aadharNo: data?.patient?.aadharNo,
            medicalCase: data?.medicalCase,
            guardianName: data?.guardianName,
            guardianContactNo: data?.guardianContactNo,
            drrefferal: data?.drrefferal,
            dateOfAdmission: data?.dateOfAdmission,
            dateOfDeparture: data?.dateOfDeparture,
            admissioncharge: data?.admissioncharge,
          });

          setBillingStatus(data.billingStatus);
          setAccomodation(data?.billing?.accommodationDetails);
          setanotherAccomodation(data?.billing?.anotheraccomodation);
          setDiagnosticCharges(data?.billing?.diagnosticCharges);
          setServiceCharge(data?.billing?.serviceCharge);
          setDoctor(data?.billing?.doctor);
          setNursingCharge(data?.billing?.nursingCharge);
          setMedicineCharges(data?.billing?.medicineCharges);
          setOtDetails(data?.billing?.otCharge);
          setOtMedicines(data?.billing?.otMedicines);
          setTaxDetails(data?.billing?.taxDetails);
          setDischargeMedicines(data?.billing?.dischargeMedicines);
          setSpecialNeeds(data?.billing?.specialNeeds);
          setAmbulationCharge(data?.billing?.ambulationCharge);
          setPatientSummary(data?.billing?.patientSummary);
          setAdmissionSummary(data?.billing?.admissionSummary);

          if (data?.billing?.total) setTotal(data?.billing?.total);
          else
            setTotal({
              totalCharge: data?.billing?.totalCharge,
              payableAmount: data?.billing?.payableAmount,
              netPayableAmount: data?.billing?.netPayableAmount,
            });

          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    fetchDetailsByAdmissionID();
  }, [admissionid]);

  useEffect(() => {
    // console.log(medicineCharges.total);
    if (admissionData.billingDone) {
      let totalCharge = medicineCharges?.total || 0;

      totalCharge += parseInt(diagnosticCharges.total) || 0;
      totalCharge += parseInt(serviceCharge.total) || 0;
      totalCharge += parseInt(accomodation.total) || 0;
      totalCharge += parseInt(anotheraccomodation.total) || 0;
      totalCharge += parseInt(doctor.total) || 0;
      totalCharge += parseInt(nursingCharge.total) || 0;
      // totalCharge += parseInt(medicineCharges.total) || 0;
      totalCharge += parseInt(otDetails.total) || 0;
      totalCharge += parseInt(otMedicines?.total) || 0;
      // totalCharge += parseInt(dischargeMedicines.total) || 0;
      totalCharge += parseInt(specialNeeds.total) || 0;
      totalCharge += parseInt(ambulationCharge) || 0;

      let totalLocal = { ...total };
      let payableAmount = totalCharge,
        netPayableAmount;

      payableAmount -= parseInt(totalLocal.discount) || 0;
      payableAmount -= parseInt(totalLocal.advancePaid) || 0;
      payableAmount -= parseInt(totalLocal.roundOff) || 0;

      netPayableAmount = payableAmount + (parseInt(totalLocal.cgst) || 0);
      netPayableAmount += parseInt(totalLocal.sgst) || 0;
      netPayableAmount += parseInt(totalLocal.tds) || 0;

      setTotal({
        ...total,
        totalCharge: totalCharge,
        payableAmount: payableAmount,
        netPayableAmount: netPayableAmount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accomodation,
    diagnosticCharges,
    serviceCharge,
    doctor,
    anotheraccomodation,
    nursingCharge,
    medicineCharges,
    otDetails,
    otMedicines,
    dischargeMedicines,
    specialNeeds,
    ambulationCharge,
  ]);

  const handlePatientDetailsChange = (e) => {
    let { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleTotalChange = (e) => {
    let { name, value } = e.target;
    let totalLocal = { ...total };
    totalLocal[name] = value;
    let payableAmount = totalLocal.totalCharge,
      netPayableAmount;

    payableAmount -= parseInt(totalLocal.discount) || 0;
    payableAmount -= parseInt(totalLocal.advancePaid) || 0;
    payableAmount -= parseInt(totalLocal.roundOff) || 0;

    netPayableAmount = payableAmount + (parseInt(totalLocal.cgst) || 0);
    netPayableAmount += parseInt(totalLocal.sgst) || 0;
    netPayableAmount += parseInt(totalLocal.tds) || 0;

    setTotal({
      ...total,
      [name]: value,
      payableAmount: payableAmount,
      netPayableAmount: netPayableAmount,
    });
  };

  const handlebedCharge = (e) => {
    let { name, value } = e.target;
    value = parseInt(value);
    let totalBedCharge;

    if (name === "chargeperday")
      totalBedCharge = value * accomodation.numberofdays || 0;
    else if (name === "numberofdays")
      totalBedCharge = value * accomodation.chargeperday || 0;

    setAccomodation({
      ...accomodation,
      [name]: value,
      total: totalBedCharge,
    });
  };

  const calculate2ndBedcharge = (e) => {
    let { name, value } = e.target;
    // value = parseInt(value);
    let totalbedCharge;

    if (name === "chargeperday")
      totalbedCharge = value * anotheraccomodation.numberofdays;
    else if (name === "numberofdays")
      totalbedCharge = value * anotheraccomodation.chargeperday;

    setanotherAccomodation({
      ...anotheraccomodation,
      [name]: value,
      total: totalbedCharge,
    });
  };

  const handleService = (e) => {
    let { name, type, value } = e.target;
    value = parseInt(+value);

    let totalService;

    if (name === "charge") {
      totalService = value * serviceCharge.numberofdays || 0;
    } else if (name === "numberofdays") {
      totalService = value * serviceCharge.charge || 0;
    }

    setServiceCharge({
      ...serviceCharge,
      [name]: value,
      total: totalService,
    });
  };

  const calculateDoctorCharge = (e) => {
    let { name, value } = e.target;
    value = parseInt(value);
    let totalDoctorCharge;

    if (name === "doctorChargePerVisit")
      totalDoctorCharge = value * doctor.noOfVisit;
    else if (name === "noOfVisit")
      totalDoctorCharge = value * doctor.doctorChargePerVisit;

    setDoctor({ ...doctor, [name]: value, total: totalDoctorCharge });
  };

  const handleOtDetailsChange = (e) => {
    let { name, value, type } = e.target;

    if (type === "number") {
      value = parseInt(value);
      let totalOTCharge =
        otDetails.total - (parseInt(otDetails[name]) || 0) + (value || 0);
      setOtDetails({ ...otDetails, [name]: value, total: totalOTCharge });
    } else {
      setOtDetails({ ...otDetails, [name]: value });
    }
  };

  const calculateNursingCharge = (e, nursingType) => {
    let { name, value } = e.target;
    value = parseInt(value);

    if (name === "days") {
      let feesPerDay = nursingCharge[nursingType].feesPerDay ?? 0;
      let total = feesPerDay * (value || 0);
      let nursingTotal =
        (nursingCharge.total ?? 0) -
        (nursingCharge[nursingType].total ?? 0) +
        total;

      setNursingCharge({
        ...nursingCharge,
        [nursingType]: { days: value, feesPerDay, total },
        total: nursingTotal,
      });
    } else if (name === "feesPerDay") {
      let days = nursingCharge[nursingType].days ?? 0;
      let total = days * (value || 0);
      let nursingTotal =
        (nursingCharge.total ?? 0) -
        (nursingCharge[nursingType].total ?? 0) +
        total;

      setNursingCharge({
        ...nursingCharge,
        [nursingType]: { days, feesPerDay: value, total },
        total: nursingTotal,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });
  }, []);

  console.log(billingStatus);

  const handleSubmit = () => {
    const { admissionId, admission, fullname } = patientDetails;
    setEnter(true)

    if (admissionId && admission && fullname) {
      let payload = {
        patientId: admissionData.patient._id,
        patientDetails,
        admissionId,

        billingDone: admissionData.billingDone,
      };
      if (admissionData.billingDone) {
        payload = {
          ...payload,
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
          ambulationCharge,
          patientSummary,
          admissionSummary,
          billingStatus,
          total,
        };
      }
      axios
        .post("/api/edit-admission", payload)
        .then(({ data }) => {
          // console.log(data);
          toast.success(data.message);
          Router.push("/patientrecord");
          setEnter(false);
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
          setEnter(false);
        });
    } else {
      toast.warn("Please fill all necessary fields");
    }
  };

  if (loading) {
    return <LodingScreen />;
  }

  return (
    <>
      <Navbar />
      <Heading title="Billing" />
      <div className="flex  justify-center w-full my-6 ">
        <div className=" p-5 bg-red-100 rounded-md  ">
          <div className="form-control">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Enter Admission Id
              </span>
              <input
                type="tel"
                name="admissionId"
                value={patientDetails?.admissionId}
                readOnly
                placeholder="Enter Admission Id "
                className="input input-bordered border-black w-96"
              />
              <Link href="/patientrecord" className={`btn  `}>
                Cancel
              </Link>
            </label>
          </div>

          <div className="form-control mt-4 w-full">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Full name</span>
              <input
                type="text"
                name="fullname"
                value={patientDetails?.fullname}
                onChange={handlePatientDetailsChange}
                placeholder="Enter full Name "
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>
          <div className="form-control mt-4 ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">Gender</span>
              <select
                name="gender"
                value={patientDetails?.gender}
                onChange={handlePatientDetailsChange}
                className="input input-bordered border-black w-8/12 text-xl ">
                <option>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">age</span>
              <input
                type="tel"
                name="age"
                value={patientDetails?.age}
                onChange={handlePatientDetailsChange}
                placeholder="Enter Age"
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Contact number</span>
              <input
                type="tel"
                name="contactNo"
                value={patientDetails?.contactNo}
                onChange={handlePatientDetailsChange}
                placeholder="Enter Contact No."
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Aadhar Number</span>
              <input
                type="tel"
                name="aadharNo"
                value={patientDetails?.aadharNo}
                onChange={handlePatientDetailsChange}
                placeholder="Aadhar No."
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Address</span>
              <textarea
                type="text"
                readOnly
                name="address"
                value={patientDetails.address}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    address: e.target.value,
                  })
                }
                className="input input-bordered border-black w-8/12 "></textarea>
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Guardian name</span>
              <input
                type="text"
                name="guardianName"
                value={patientDetails?.guardianName}
                onChange={handlePatientDetailsChange}
                placeholder="Guardian Name "
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Guardian Number</span>
              <input
                type="tel"
                name="guardianContactNo"
                value={patientDetails?.guardianContactNo}
                onChange={handlePatientDetailsChange}
                placeholder="Guardian Name "
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Medical Case</span>
              <input
                type="text"
                name="medicalCase"
                value={patientDetails?.medicalCase}
                onChange={handlePatientDetailsChange}
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4 ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">
                Admission Type{" "}
              </span>
              <select
                type="text"
                name="admissiontype"
                value={patientDetails?.admissiontype}
                onChange={handlePatientDetailsChange}
                className="input input-bordered border-black w-8/12 text-xl ">
                <option>Select</option>
                <option value="General">General</option>
                <option value="Swastha Swathi">Swastha Swathi</option>
                <option value="Cashless">Cashless</option>
              </select>
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Date of Admission
              </span>
              <input
                type="date"
                name="dateOfAdmission"
                value={patientDetails?.dateOfAdmission}
                onChange={handlePatientDetailsChange}
                placeholder="Guardian Contact No. "
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          {/* <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Date of Departure
              </span>
              <input
                type="date"
                name="dateOfDeparture"
                value={patientDetails?.dateOfDeparture}
                onChange={handlePatientDetailsChange}
                placeholder="Guardian Contact No. "
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div> */}

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Admission Charge
              </span>
              <input
                type="text"
                name="admissioncharge"
                value={patientDetails?.admissioncharge}
                onChange={handlePatientDetailsChange}
                placeholder="Admission Charge"
                className="input input-bordered border-black w-8/12 "
              />
            </label>
          </div>
        </div>
      </div>

      {admissionData.billingDone ? (
        <>
          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Accommodation Type 1st Bed
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4 w-auto ">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold ">Bed type</span>
                  <select
                    name="bedType"
                    value={accomodation?.bedType}
                    onChange={handlebedCharge}
                    className="input input-bordered border-black  w-[400px] text-xl ">
                    <option>Select Bed type</option>
                    <option value="ICCU">ICCU</option>
                    <option value="HDU">HDU</option>
                    <option value="NICU">NICU</option>
                    <option value="PICU">PICU</option>
                    <option value="SNCU">SNCU</option>
                    <option value="General cabin">General cabin</option>
                    <option value="Delux cabin">Delux cabin</option>
                    <option value="Double bed D.cabin">
                      Double bed D.cabin
                    </option>
                    <option value="Isolation">Isolation</option>
                    <option value="General bed">General bed</option>
                    <option value="General bed AC">General bed AC</option>
                    <option value="Meternity ward">Meternity ward</option>
                    <option value="ICU">ICU isolation</option>
                    <option value="Emergency bed">Emergency bed</option>
                  </select>
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Bed number</span>
                  <input
                    type="number"
                    name="bedNo"
                    value={accomodation?.bedNo}
                    onChange={(e) =>
                      setAccomodation({
                        ...accomodation,
                        bedNo: e.target.value,
                      })
                    }
                    className="input input-bordered border-black w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Number of Day
                  </span>
                  <input
                    type="number"
                    name="numberofdays"
                    value={accomodation?.numberofdays}
                    onChange={handlebedCharge}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Charge Per Day{" "}
                  </span>
                  <input
                    type="number"
                    name="chargeperday"
                    value={accomodation?.chargeperday}
                    onChange={handlebedCharge}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="number"
                    name="total"
                    value={accomodation?.total}
                    onChange={handlebedCharge}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Accommodation Type 2nd Bed
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">BED TYPE</span>
                  <input
                    type="text"
                    name="anotherBed"
                    value={anotheraccomodation.anotherBed}
                    onChange={calculate2ndBedcharge}
                    className="input input-bordered border-black w-[400px]"
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Bed number</span>
                  <input
                    type="number"
                    name="bedNo"
                    value={anotheraccomodation?.bedNo}
                    onChange={calculate2ndBedcharge}
                    className="input input-bordered border-black w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Number of Day
                  </span>
                  <input
                    type="number"
                    name="numberofdays"
                    value={anotheraccomodation?.numberofdays}
                    onChange={calculate2ndBedcharge}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Charge Per Day{" "}
                  </span>
                  <input
                    type="number"
                    name="chargeperday"
                    value={anotheraccomodation?.chargeperday}
                    onChange={calculate2ndBedcharge}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="number"
                    name="total"
                    value={anotheraccomodation?.total}
                    onChange={calculate2ndBedcharge}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Diagnostic Charges
          </div>
          <DiagnosticInput
            diagData={diagnosticCharges}
            setDiagData={setDiagnosticCharges}
          />

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Service Charge
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4 w-auto ">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold ">
                    Service Type
                  </span>
                  <select
                    name="serviceType"
                    value={serviceCharge?.serviceType}
                    onChange={(e) =>
                      setServiceCharge({
                        ...serviceCharge,
                        serviceType: e.target.value,
                      })
                    }
                    className="input input-bordered border-black  w-[400px] text-xl ">
                    <option>Select service type</option>
                    <option value="general">General</option>
                    <option value="special">Special</option>
                  </select>
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Charge Per Day{" "}
                  </span>
                  <input
                    type="number"
                    name="charge"
                    value={serviceCharge?.charge}
                    onChange={handleService}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Number of Day
                  </span>
                  <input
                    type="number"
                    name="numberofdays"
                    value={serviceCharge.numberofdays}
                    onChange={handleService}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="number"
                    name="total"
                    value={serviceCharge.total}
                    onChange={handleService}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Doctor Charge
          </div>
          <Doctorinputes setDoctorData={setDoctor} doctor={doctor} />

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Nursing Charge
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <p className="  text-center"> General</p>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Charge Per Day{" "}
                  </span>
                  <input
                    type="number"
                    name="feesPerDay"
                    value={nursingCharge?.general?.feesPerDay}
                    onChange={(e) => calculateNursingCharge(e, "general")}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Number of Day
                  </span>
                  <input
                    type="number"
                    name="days"
                    value={nursingCharge?.general?.days}
                    onChange={(e) => calculateNursingCharge(e, "general")}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="number"
                    readOnly
                    value={nursingCharge?.general?.total}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <p className="  text-center"> Special Care</p>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Charge Per Day{" "}
                  </span>
                  <input
                    name="feesPerDay"
                    type="number"
                    value={nursingCharge?.specialCare?.feesPerDay}
                    onChange={(e) => calculateNursingCharge(e, "specialCare")}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Number of Day
                  </span>
                  <input
                    name="days"
                    type="number"
                    value={nursingCharge?.specialCare?.days}
                    onChange={(e) => calculateNursingCharge(e, "specialCare")}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="number"
                    value={nursingCharge?.specialCare?.total}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <p className="  text-center"> AAYA</p>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Charge Per Day{" "}
                  </span>
                  <input
                    name="feesPerDay"
                    type="number"
                    value={nursingCharge?.aaya?.feesPerDay}
                    onChange={(e) => calculateNursingCharge(e, "aaya")}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Number of Day
                  </span>
                  <input
                    name="days"
                    type="number"
                    value={nursingCharge?.aaya?.days}
                    onChange={(e) => calculateNursingCharge(e, "aaya")}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="tel"
                    value={nursingCharge?.aaya?.total}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            OT Details
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4 w-auto ">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold ">
                    Types of OT{" "}
                  </span>
                  <select
                    name="typeOfOt"
                    value={otDetails?.typeOfOt}
                    onChange={handleOtDetailsChange}
                    className="input input-bordered border-black  w-[400px] text-xl ">
                    <option>Select type</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                  </select>
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Surgeon name
                  </span>
                  <input
                    type="text"
                    name="surgeonName"
                    value={otDetails?.surgeonName}
                    onChange={handleOtDetailsChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Surgeon Charge
                  </span>
                  <input
                    type="number"
                    name="surgeonCharge"
                    value={otDetails?.surgeonCharge}
                    onChange={handleOtDetailsChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Anaesthetist name
                  </span>
                  <input
                    type="text"
                    name="anaesthetistName"
                    value={otDetails?.anaesthetistName}
                    onChange={handleOtDetailsChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Anaesthesia Charge
                  </span>
                  <input
                    type="number"
                    name="anaesthesiaCharge"
                    value={otDetails?.anaesthesiaCharge}
                    onChange={handleOtDetailsChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    OT room charge
                  </span>
                  <input
                    type="number"
                    name="otRoomCharge"
                    value={otDetails?.otRoomCharge}
                    onChange={handleOtDetailsChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Extra Charge
                  </span>
                  <input
                    type="number"
                    name="extraCharge"
                    value={otDetails?.extraCharge}
                    onChange={handleOtDetailsChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="number"
                    name="total"
                    value={otDetails?.total}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Special Needs
          </div>
          <SpecialNeedsInput
            enterItem="itemName"
            setItemData={setSpecialNeeds}
            itemData={specialNeeds}
          />

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Ambulance charge
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Ambulance charge{" "}
                  </span>
                  <input
                    type="number"
                    value={ambulationCharge}
                    onChange={(e) => setAmbulationCharge(e.target.value)}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Patient Summary
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Chief complaint
                  </span>
                  <input
                    type="text"
                    value={patientSummary?.chiefComplaint}
                    onChange={(e) =>
                      setPatientSummary({
                        ...patientSummary,
                        chiefComplaint: e.target.value,
                      })
                    }
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Present illness
                  </span>
                  <input
                    type="text"
                    value={patientSummary?.presentIllness}
                    onChange={(e) =>
                      setPatientSummary({
                        ...patientSummary,
                        presentIllness: e.target.value,
                      })
                    }
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Admission Summary
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Discharge condition
                  </span>
                  <input
                    type="text"
                    value={admissionSummary?.dischargeCondition}
                    onChange={(e) =>
                      setAdmissionSummary({
                        ...admissionSummary,
                        dischargeCondition: e.target.value,
                      })
                    }
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Discharge advice
                  </span>
                  <input
                    type="text"
                    value={admissionSummary?.dischargeAdvice}
                    onChange={(e) =>
                      setAdmissionSummary({
                        ...admissionSummary,
                        dischargeAdvice: e.target.value,
                      })
                    }
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Billing Status
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Billing Status
                  </span>
                  <select
                    name="billingStatus"
                    value={billingStatus}
                    className="input input-bordered border-black  w-[400px]"
                    onChange={(e) => setBillingStatus(e.target.value)}>
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                  </select>
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Date of Discharge
                  </span>
                  <input
                    type="date"
                    name="dateOfDeparture"
                    value={patientDetails?.dateOfDeparture}
                    onChange={handlePatientDetailsChange}
                    placeholder="Guardian Contact No. "
                    className="input input-bordered border-black w-8/12"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="btn btn-block rounded-none cursor-default text-lg ">
            Total Cost
          </div>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Total Charge
                  </span>
                  <input
                    type="tel"
                    readOnly
                    value={total.totalCharge}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Advance paid
                  </span>
                  <input
                    type="number"
                    name="advancePaid"
                    value={total?.advancePaid}
                    onChange={handleTotalChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Discount on total (in amount)
                  </span>
                  <input
                    type="number"
                    name="discount"
                    value={total?.discount}
                    onChange={handleTotalChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    CGST (in amount)
                  </span>
                  <input
                    type="number"
                    name="cgst"
                    value={total?.cgst}
                    onChange={handleTotalChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    SGST (in amount){" "}
                  </span>
                  <input
                    type="number"
                    name="sgst"
                    value={total?.sgst}
                    onChange={handleTotalChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    TDS (in amount)
                  </span>
                  <input
                    type="number"
                    name="tds"
                    value={total?.tds}
                    onChange={handleTotalChange}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    {" "}
                    Payable Amount
                  </span>
                  <input
                    type="number"
                    value={total.netPayableAmount}
                    readOnly
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="flex justify-center mt-5  ">
        <button
          onClick={handleSubmit}
          className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ${
            enter ? "loading" : ""
          } `}>
          Update
        </button>
      </div>
    </>
  );
};

EditAdmission.adminRoute = true;
export default EditAdmission;
