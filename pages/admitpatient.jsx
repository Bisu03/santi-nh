import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import Router from "next/router";
import { generatePatientAdmissionId } from "../utils/generateuniqueId";

const admitpatient = () => {
  const initialFormdata = {
    fullname: "",
    patientId: "",
    admissionId: generatePatientAdmissionId(),
    gender: "select",
    age: "",
    contactNo: "",
    aadharNo: "",
    address: "",
    drrefferal: "",
    admissiontype: "",
    guardianName: "",
    guardianContactNo: "",
    medicalCase: "",
    dateOfAdmission: new Date().toISOString().substring(0, 10),
    admissioncharge: "",
    advance: "",
  };

  const [formdata, setFormdata] = useState(initialFormdata);

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

  const [accomodation, setAccomodation] = useState({
    bedType: "",
    bedNo: "",
    chargeperday: "",
    numberofdays: "",
    total: "",
  });


  const [loding, setLoding] = useState(false);

  useEffect(() => {
    console.log(formdata);
  }, [formdata]);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleOnsubmit = async () => {
    if (!formdata.fullname) {
      toast("Please enter patient full name");
      return;
    } else if (formdata.gender == "") {
      toast("Choose gender");
      return;
    } else if (!formdata.contactNo) {
      toast("Please enter patient phone no.");
      return;
    } else if (!formdata.address) {
      toast("Please enter patient address");
      return;
    }
    setLoding(true);

    const {
      fullname,
      patientId,
      admissionId,
      gender,
      age,
      contactNo,
      aadharNo,
      address,
      drrefferal,
      admissiontype,
      guardianName,
      guardianContactNo,
      medicalCase,
      dateOfAdmission,
      admissioncharge,
      advance,
    } = formdata;

    try {
      const { data } = await axios.post("/api/admit-patient", {
        fullname,
        patientId,
        admissionId,
        gender,
        age,
        contactNo,
        aadharNo,
        address,
        drrefferal,
        admissiontype,
        guardianName,
        guardianContactNo,
        medicalCase,
        dateOfAdmission,
        admissioncharge,
        specialNeeds,
        doctor,
        diagnosticCharges,
        advance,
        accomodation,
      });
      setFormdata(initialFormdata);
      setLoding(false);
      Router.push("/patientrecord");
      toast.success(data.message);
    } catch (error) {
      setLoding(false);
      console.log(error);
      toast.warn("something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <Heading title="Admit Patient" />
      <div className="flex  justify-center w-full my-6 ">
        <div className=" p-5 bg-red-100 rounded-md  ">
          <div className="form-control">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Full name</span>
              <input
                name="fullname"
                value={formdata.fullname}
                onChange={handleChange}
                required
                type="text"
                placeholder="Enter full Name "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>
          <div className="form-control mt-4 ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">Gender</span>
              <select
                name="gender"
                value={formdata.gender}
                onChange={handleChange}
                className="input input-bordered border-black w-80 text-xl ">
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
                value={formdata.age}
                onChange={handleChange}
                required
                placeholder="Enter Age "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Contact number</span>
              <input
                type="tel"
                name="contactNo"
                value={formdata.contactNo}
                onChange={handleChange}
                placeholder="Enter Contact No. "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Aadhar Number</span>
              <input
                type="tel"
                name="aadharNo"
                value={formdata.aadharNo}
                onChange={handleChange}
                placeholder="Aadhar No. "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Address</span>
              <textarea
                type="text"
                name="address"
                value={formdata.address}
                onChange={handleChange}
                placeholder="Address"
                className="input input-bordered border-black w-80 "></textarea>
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Guardian name</span>
              <input
                type="text"
                name="guardianName"
                value={formdata.guardianName}
                onChange={handleChange}
                placeholder="Guardian Name "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Guardian contact number
              </span>
              <input
                type="text"
                name="guardianContactNo"
                value={formdata.guardianContactNo}
                onChange={handleChange}
                placeholder="Guardian Contact No. "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Doctor Name</span>
              <input
                type="text"
                name="drrefferal"
                value={formdata.drrefferal}
                onChange={handleChange}
                placeholder="Doctor Name"
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4 ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">
                Admission Type{" "}
              </span>
              <select
                name="admissiontype"
                value={formdata.admissiontype}
                onChange={handleChange}
                className="input input-bordered border-black w-80 text-xl ">
                <option>Select</option>
                <option value="General">General</option>
                <option value="Swastha Swathi">Swastha Swathi</option>
                <option value="Cashless">Cashless</option>
              </select>
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Disease</span>

              <textarea
                type="text"
                name="medicalCase"
                value={formdata.medicalCase}
                onChange={handleChange}
                placeholder="Disease"
                required
                className="input input-bordered border-black w-80 "></textarea>
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
                value={formdata.dateOfAdmission}
                onChange={handleChange}
                placeholder="Guardian Contact No. "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Admission Charge{" "}
              </span>
              <input
                type="text"
                name="admissioncharge"
                value={formdata.admissioncharge}
                onChange={handleChange}
                placeholder="Admission Charge"
                className="input input-bordered border-black w-80 "
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Advance </span>
              <input
                type="text"
                name="advance"
                value={formdata.advance}
                onChange={handleChange}
                placeholder="Advance Payment"
                className="input input-bordered border-black w-80 "
              />
            </label>
          </div>

          <div className="form-control mt-4 ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">Bed type</span>
              <select
                name="bed-type"
                value={accomodation?.bedType}
                onChange={(e) =>
                  setAccomodation({
                    ...accomodation,
                    bedType: e.target.value,
                  })
                }
                className="input input-bordered border-black  w-80 text-xl ">
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
                name="bedNo"
                value={accomodation?.bedNo}
                onChange={(e) =>
                  setAccomodation({
                    ...accomodation,
                    bedNo: e.target.value,
                  })
                }
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="flex justify-center mt-5  ">
            <button
              onClick={handleOnsubmit}
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

admitpatient.adminRoute = true;
export default admitpatient;
