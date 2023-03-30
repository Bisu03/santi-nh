import React, { useEffect, useState } from "react";
import DiagnosticInput from "../components/DiagnosticInput";
import Doctorinputes from "../components/Doctorinputes";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import SpecialNeedsInput from "../components/SpecialNeedsInput";
import Router from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

const billing = () => {
  const [enter, setEnter] = useState(false);
  const [loding, setloding] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    admissionId: "",
    admission: "",
    fullname: "",
    gender: "select",
    age: "",
    contactNo: "",
    aadharNo: "",
    address: "",
    guardianName: "",
    medicalCase: "",
    admissioncharge: "",
    dateOfAdmission: "",
    dateOfDeparture: new Date().toISOString().substring(0, 10),
  });
  const [accomodation, setAccomodation] = useState({
    bedType: "",
    bedNo: "",
    chargeperday: "",
    numberofdays: "",
    total: "",
  });
  const [anotheraccomodation, setanotherAccomodation] = useState({
    bedType: "",
    bedNo: "",
    chargeperday: "",
    numberofdays: "",
    total: "",
  });
  const [serviceCharge, setServiceCharge] = useState({
    serviceType: "select",
    charge: "",
    numberofdays: "",
    total: "",
  });
  const [nursingCharge, setNursingCharge] = useState({
    general: { days: "", feesPerDay: "", total: "" },
    specialCare: { days: "", feesPerDay: "", total: "" },
    aaya: { days: "", feesPerDay: "", total: "" },
    total: "",
  });

  const [medicineCharges, setMedicineCharges] = useState({
    items: [
      {
        medicineName: "",
        batchNo: "",
        brand: "",
        costPerStrip: "",
        costPerVial: "",
        quantity: "",
        total: "",
      },
    ],
    total: "",
  });
  const [otDetails, setOtDetails] = useState({
    typeOfOt: "select",
    surgeonName: "",
    surgeonCharge: "",
    anaesthetistName: "",
    anaesthesiaCharge: "",
    otRoomCharge: "",
    extraCharge: "",
    total: "",
  });
  const [diagnosticCharges, setDiagnosticCharges] = useState({
    items: [
      {
        testName: "",
        testDetails: "",
        cost: "",
        drReferral: "",
        total: "",
      },
    ],
    total: "",
  });
  const [doctor, setDoctor] = useState({
    items: [
      {
        doctorname: "",
        numberofvisit: "",
        chargepervisit: "",
        total: "",
      },
    ],
    total: "",
  });

  const [specialNeeds, setSpecialNeeds] = useState({
    items: [
      {
        itemName: "",
        hourPerDay: "",
        ratePerHour: "",
        total: "",
      },
    ],
    total: "",
  });

  const [ambulationCharge, setAmbulationCharge] = useState("");
  const [billingStatus, setBillingStatus] = useState("Done");
  const [patientSummary, setPatientSummary] = useState({
    chiefComplaint: "",
    presentIllness: "",
  });
  const [admissionSummary, setAdmissionSummary] = useState({
    dischargeCondition: "",
    dischargeAdvice: "",
  });

  const [total, setTotal] = useState({
    totalCharge: "",
    advancePaid: "",
    discount: "",
    cgst: "",
    sgst: "",
    tds: "",
    netPayableAmount: "",
  });

  useEffect(() => {
    let totalCharge = 0;

    totalCharge += parseInt(accomodation.total) || 0;
    totalCharge += parseInt(anotheraccomodation.total) || 0;
    totalCharge += parseInt(diagnosticCharges.total) || 0;
    totalCharge += parseInt(serviceCharge.total) || 0;
    totalCharge += parseInt(doctor.total) || 0;
    totalCharge += parseInt(nursingCharge.total) || 0;
    totalCharge += parseInt(medicineCharges.total) || 0;
    totalCharge += parseInt(otDetails.total) || 0;
    // totalCharge += parseInt(otMedicines.total) || 0;
    // totalCharge += parseInt(dischargeMedicines.total) || 0
    totalCharge += parseInt(specialNeeds.total) || 0;
    totalCharge += parseInt(ambulationCharge) || 0;

    let totalLocal = { ...total };
    let payableAmount = totalCharge,
      netPayableAmount;

    payableAmount -= parseInt(totalLocal.advancePaid) || 0;
    payableAmount -= parseInt(totalLocal.discount) || 0;
    // payableAmount -= parseInt(totalLocal.roundOff) || 0;

    netPayableAmount = payableAmount + (parseInt(totalLocal.cgst) || 0);
    netPayableAmount += parseInt(totalLocal.sgst) || 0;
    netPayableAmount += parseInt(totalLocal.tds) || 0;

    setTotal({
      ...total,
      totalCharge: totalCharge,
      payableAmount: payableAmount,
      netPayableAmount: netPayableAmount,
    });

    document.addEventListener("wheel", function (event) {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    diagnosticCharges,
    serviceCharge,
    doctor,
    nursingCharge,
    accomodation,
    anotheraccomodation,
    medicineCharges,
    otDetails,
    // otMedicines,
    // dischargeMedicines,
    specialNeeds,
    ambulationCharge,
  ]);

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
    // console.log(finaltotal)
  };

  // const calculateDoctorCharge = (e) => {
  //   let { name, value } = e.target
  //   value = parseInt(value)
  //   let totalDoctorCharge

  //   if (name === 'doctorChargePerVisit')
  //     totalDoctorCharge = value * doctor.noOfVisit
  //   else if (name === 'noOfVisit')
  //     totalDoctorCharge = value * doctor.doctorChargePerVisit

  //   setDoctor({ ...doctor, [name]: value, total: totalDoctorCharge })
  // }

  const calculateBedcharge = (e) => {
    let { name, value } = e.target;
    // value = parseInt(value);
    let totalbedCharge;

    if (name === "chargeperday")
      totalbedCharge = value * accomodation.numberofdays;
    else if (name === "numberofdays")
      totalbedCharge = value * accomodation.chargeperday;

    setAccomodation({ ...accomodation, [name]: value, total: totalbedCharge });
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

  const handleOtDetailsChange = (e) => {
    let { name, value, type } = e.target;
    // console.log(type);

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

  const fetchDetailsByAdmissionID = () => {
    setEnter(true);
    if (!patientDetails.admissionId) {
      toast("Please enter the admission ID");
      return;
    }

    if (patientDetails.admissionId) {
      axios
        .get(`/api/admission-details/` + patientDetails.admissionId)
        .then(({ data }) => {
          setPatientDetails({
            ...patientDetails,
            fullname: data?.patient?.fullname,
            admission: data?._id,
            gender: data?.patient?.gender,
            age: data?.age,
            medicalCase: data?.medicalCase,
            address: data?.patient?.address,
            guardianName: data?.guardianName,
            contactNo: data?.patient?.contactNo,
            aadharNo: data?.patient?.aadharNo,
            dateOfAdmission: data?.dateOfAdmission,
            admissioncharge: data?.admissioncharge,
          });
          setEnter(false);
          toast.success("Data Added");
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
          setEnter(false);
        });
    } else {
      toast("Please enter correct admission ID");
    }
  };

  const handleSubmit = () => {
    setloding(true);
    const { admissionId, admission, fullname, dateOfDeparture } =
      patientDetails;

    if (admissionId && admission && fullname) {
      axios
        .post("/api/billing", {
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
          // dischargeMedicines,
          specialNeeds,
          ambulationCharge,
          patientSummary,
          admissionSummary,
          billingStatus,
          dateOfDeparture: patientDetails.dateOfDeparture,
          total,
        })
        .then(({ data }) => {
          console.log(data);
          setloding(false);
          toast.success(data.message);
          Router.push("/patientrecord");
        })
        .catch((err) => {
          toast.warn("something went wrong");
          console.error(err);
        });
    } else {
      setloding(false);
      alert("Please enter Patient details by Admission ID");
    }
  };

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
                type="number"
                name="admissionId"
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    admissionId: e.target.value,
                  })
                }
                value={patientDetails.admissionId}
                required
                placeholder="Enter Admission Id "
                className="input input-bordered border-black w-96"
              />
              <button
                onClick={fetchDetailsByAdmissionID}
                className={`btn ${enter ? "loading" : ""} `}>
                Enter
              </button>
            </label>
          </div>

          <div className="form-control mt-4 w-full">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Full name</span>
              <input
                type="text"
                readOnly
                name="fullname"
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    fullname: e.target.value,
                  })
                }
                value={patientDetails.fullname}
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
                readOnly
                value={patientDetails.gender}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    gender: e.target.value,
                  })
                }
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
                type="number"
                name="age"
                readOnly
                value={patientDetails?.age}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    age: e.target.value,
                  })
                }
                placeholder="Enter Age"
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Contact number</span>
              <input
                type="number"
                readOnly
                name="contactNo"
                value={patientDetails.contactNo}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    contactNo: e.target.value,
                  })
                }
                placeholder="Enter Contact No."
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Aadhar Number</span>
              <input
                type="number"
                readOnly
                name="aadharNo"
                value={patientDetails.aadharNo}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    aadharNo: e.target.value,
                  })
                }
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
                readOnly
                name="guardianName"
                value={patientDetails.guardianName}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    guardianName: e.target.value,
                  })
                }
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
                readOnly
                name="medicalCase"
                value={patientDetails.medicalCase}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    medicalCase: e.target.value,
                  })
                }
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          {/* <div className="form-control mt-4 ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">
                Admission Type{" "}
              </span>
              <select
                type="text"
                readOnly
                name="medicalCase"
                value={patientDetails.medicalCase}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    guardianName: e.target.value,
                  })
                }
                className="input input-bordered border-black w-8/12 text-xl ">
                <option>Select</option>
                <option value="General">General</option>
                <option value="Swastha Swathi">Swastha Swathi</option>
                <option value="Cashless">Cashless</option>
              </select>
            </label>
          </div> */}

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Date of Admission
              </span>
              <input
                type="date"
                name="dateOfAdmission"
                value={patientDetails?.dateOfAdmission}
                readOnly
                placeholder="Guardian Contact No. "
                className="input input-bordered border-black w-8/12"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Admission Charge
              </span>
              <input
                type="text"
                readOnly
                // name="admissioncharge"
                value={patientDetails?.admissioncharge}
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    admissioncharge: e.target.value,
                  })
                }
                placeholder="Admission Charge"
                className="input input-bordered border-black w-8/12 "
              />
            </label>
          </div>
        </div>
      </div>

      <div className="btn btn-block rounded-none cursor-default text-lg ">
        Accommodation Type 1st Bed
      </div>
      <div className="flex  justify-center w-auto my-6 ">
        <div className=" p-5 bg-red-100 rounded-md  ">
          <div className="form-control mt-4 w-auto ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">Bed type</span>
              <select
                name="bed-type"
                value={accomodation.bedType}
                onChange={(e) =>
                  setAccomodation({ ...accomodation, bedType: e.target.value })
                }
                className="input input-bordered border-black  w-[400px] text-xl ">
                <option>Select Bed type</option>
                <option value="ICCU">ICCU</option>
                <option value="HDU">HDU</option>
                <option value="NICU">NICU</option>
                <option value="PICU">PICU</option>
                <option value="SNCU">SNCU</option>
                <option value="General cabin">General cabin</option>
                <option value="Delux cabin">Delux cabin</option>
                <option value="Double bed D.cabin">Double bed D.cabin</option>
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
                value={accomodation.bedNo}
                onChange={(e) =>
                  setAccomodation({ ...accomodation, bedNo: e.target.value })
                }
                className="input input-bordered border-black w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Number of Day</span>
              <input
                type="number"
                name="numberofdays"
                value={accomodation.numberofdays}
                onChange={calculateBedcharge}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Charge Per Day </span>
              <input
                type="number"
                name="chargeperday"
                value={accomodation.chargeperday}
                onChange={calculateBedcharge}
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
                value={accomodation.total}
                onChange={calculateBedcharge}
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
                value={anotheraccomodation.anotherBed}
                onChange={(e) =>
                  setanotherAccomodation({
                    ...anotheraccomodation,
                    anotherBed: e.target.value,
                  })
                }
                className="input input-bordered border-black w-[400px]"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Bed number</span>
              <input
                type="number"
                value={anotheraccomodation.bedNo}
                onChange={(e) =>
                  setanotherAccomodation({
                    ...anotheraccomodation,
                    bedNo: e.target.value,
                  })
                }
                className="input input-bordered border-black w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Number of Day</span>
              <input
                type="number"
                name="numberofdays"
                value={anotheraccomodation.numberofdays}
                onChange={calculate2ndBedcharge}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Charge Per Day </span>
              <input
                type="number"
                name="chargeperday"
                value={anotheraccomodation.chargeperday}
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
                value={anotheraccomodation.total}
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
              <span className="w-60  uppercase font-bold ">Service Type</span>
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
              <span className="w-60  uppercase font-bold">Charge Per Day </span>
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
              <span className="w-60  uppercase font-bold">Number of Day</span>
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
              <span className="w-60  uppercase font-bold">Charge Per Day </span>
              <input
                type="number"
                name="feesPerDay"
                value={nursingCharge.general.feesPerDay}
                onChange={(e) => calculateNursingCharge(e, "general")}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Number of Day</span>
              <input
                type="number"
                name="days"
                value={nursingCharge.general.days}
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
                value={nursingCharge.general.total}
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
              <span className="w-60  uppercase font-bold">Charge Per Day </span>
              <input
                name="feesPerDay"
                type="number"
                value={nursingCharge.specialCare.feesPerDay}
                onChange={(e) => calculateNursingCharge(e, "specialCare")}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Number of Day</span>
              <input
                name="days"
                type="number"
                value={nursingCharge.specialCare.days}
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
                value={nursingCharge.specialCare.total}
                readOnly
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
              <span className="w-60  uppercase font-bold">Charge Per Day </span>
              <input
                name="feesPerDay"
                type="number"
                value={nursingCharge.aaya.feesPerDay}
                onChange={(e) => calculateNursingCharge(e, "aaya")}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Number of Day</span>
              <input
                name="days"
                type="number"
                value={nursingCharge.aaya.days}
                onChange={(e) => calculateNursingCharge(e, "aaya")}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Total</span>
              <input
                type="number"
                value={nursingCharge.aaya.total}
                readOnly
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
              <span className="w-60  uppercase font-bold ">Types of OT </span>
              <select
                name="typeOfOt"
                value={otDetails.typeOfOt}
                onChange={handleOtDetailsChange}
                className="input input-bordered border-black  w-[400px] text-xl ">
                <option value="select">Select type</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Surgeon name</span>
              <input
                type="text"
                name="surgeonName"
                value={otDetails.surgeonName}
                onChange={handleOtDetailsChange}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Surgeon Charge</span>
              <input
                type="number"
                name="surgeonCharge"
                value={otDetails.surgeonCharge}
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
                value={otDetails.anaesthetistName}
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
                value={otDetails.anaesthesiaCharge}
                onChange={handleOtDetailsChange}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">OT room charge</span>
              <input
                type="number"
                name="otRoomCharge"
                value={otDetails.otRoomCharge}
                onChange={handleOtDetailsChange}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Extra Charge</span>
              <input
                type="number"
                name="extraCharge"
                value={otDetails.extraCharge}
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
                value={otDetails.total}
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
              <span className="w-60  uppercase font-bold">Chief complaint</span>
              <input
                type="text"
                value={patientSummary.chiefComplaint}
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
              <span className="w-60  uppercase font-bold">Present illness</span>
              <input
                type="text"
                value={patientSummary.presentIllness}
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
                value={admissionSummary.dischargeCondition}
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
                value={admissionSummary.dischargeAdvice}
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
              <span className="w-60  uppercase font-bold">Billing Status</span>
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
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    dateOfDeparture: e.target.value,
                  })
                }
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
              <span className="w-60  uppercase font-bold">Total Charge</span>
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
              <span className="w-60  uppercase font-bold">Advance paid</span>
              <input
                type="number"
                name="advancePaid"
                value={total.advancePaid}
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
                value={total.discount}
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
                value={total.cgst}
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
                value={total.sgst}
                onChange={handleTotalChange}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">TDS (in amount)</span>
              <input
                type="number"
                name="tds"
                value={total.tds}
                onChange={handleTotalChange}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold"> Payable Amount</span>
              <input
                type="number"
                value={total.netPayableAmount}
                className="input input-bordered border-black  w-[400px]"
              />
            </label>
          </div>

          <div className="flex justify-center mt-5  ">
            <button
              onClick={handleSubmit}
              className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ${
                loding ? "loading" : ""
              } `}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default billing;
