import React, { useEffect, useState } from "react";
import NavbarTwo from "../../components/NavbarTwo";
import Heading from "../../components/Heading";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import LodingScreen from "../../components/LodingScreen";

const editcustomer = () => {
  const router = useRouter();
  const { editcustomer } = router.query;
  const [loading, setloading] = useState(false);

  let initialFormdata = {
    fullname: "",
    gender: "",
    age: "",
    contactNo: "",
    address: "",
    medicalCase: "",
    dateOfAdd: "",
  };

  const [formdata, setFormdata] = useState(initialFormdata);
  const [btnLoading, setbtnLoading] = useState(false);

  useEffect(() => {
    const fetchDetailsByAdmissionID = () => {
      setloading(true);
      axios
        .get(`/api/customerbill/${editcustomer}`)
        .then(({ data }) => {
          setFormdata(data);
          setloading(false);
          // console.log(data);
        })
        .catch((err) => {
          setloading(false);
          console.error(err);
        });
    };

    fetchDetailsByAdmissionID();
  }, [editcustomer]);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleOnsubmit = (e) => {
    e.preventDefault();
    setbtnLoading(true);
    axios
      .post("/api/editcustomer/" + editcustomer, formdata)
      .then(({ data }) => {
        setFormdata(initialFormdata);
        setbtnLoading(false);
        toast.success("Record Updated..");
        router.push("/customerrecord");
      })
      .catch((err) => {
        setbtnLoading(false);
        toast.warn("something went wrong");
      });
  };

  if (loading) {
    <LodingScreen />;
  }

  return (
    <>
      <NavbarTwo />
      <Heading title="Update Customer Record" />
      <div className="flex  justify-center w-full my-6 ">
        <div className=" p-5 bg-red-100 rounded-md  ">
          <div className="form-control">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Full name</span>
              <input
                type="text"
                name="fullname"
                value={formdata.fullname}
                onChange={handleChange}
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
              <span className="w-60  uppercase font-bold">Medical case</span>

              <textarea
                type="text"
                name="medicalCase"
                value={formdata.medicalCase}
                onChange={handleChange}
                placeholder="Medical case"
                required
                className="input input-bordered border-black w-80 "></textarea>
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Date of Add</span>
              <input
                type="date"
                name="dateOfAdd"
                value={formdata.dateOfAdd}
                onChange={handleChange}
                placeholder="Guardian Contact No. "
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="flex justify-center mt-5  ">
            <button
              onClick={handleOnsubmit}
              className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ${
                btnLoading ? "loading" : ""
              } `}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

editcustomer.adminRoute = true;
export default editcustomer;
