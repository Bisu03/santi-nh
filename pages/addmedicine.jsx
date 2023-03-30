import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";

const addmedicine = () => {
  const initialData = {
    expiry: "",
    medicineName: "",
    batchNo: "",
    brand: "",
    costPerStrip: "",
    costPervial: "",
    quantity: "",
  };
  const [formData, setFormData] = useState({
    expiry: "",
    medicineName: "",
    batchNo: "",
    brand: "",
    costPerStrip: "",
    costPervial: "",
    quantity: "",
  });
  const [loding, setloding] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setloding(true);
    try {
      const {
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        quantity,
      } = formData;

      const { data } = await axios.post("/api/addmedicine", {
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        quantity,
      });

      if (formData.costPerStrip) {
        var totalamount = +formData.costPerStrip * +formData.quantity;
      } else {
        var totalamount = +formData.costPervial * formData.quantity;
      }

      await axios.post("/api/stockin", {
        medicineId: data._id,
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        addedquantity: quantity,
        total: totalamount,
        dateOfadd: new Date().toISOString().substring(0, 10),
      });
      toast.success("Medicine added successfully");
      console.log(data);
      setFormData(initialData);
      setloding(false);
    } catch (error) {
      console.log(error);
      setloding(false);
      toast.warn("something went wrong");
    }
  };

  return (
    <div>
      <Navbar />
      <Heading title="Medicine Entry" />
      <div className="flex  justify-center w-full my-6 ">
        <div className=" p-5 bg-red-100 rounded-md  ">
          <div className="form-control">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Medicine Name</span>
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                required
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>
          <div className="form-control mt-4 ">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">Expiry Date</span>
              <input
                type="date"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold ">Batch Number</span>
              <input
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Brand Name</span>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Quantity</span>
              <input
                type="tel"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter in number"
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="btn btn-block  btn-warning rounded-none cursor-default text-lg my-4 ">
            Cost
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Cost/Strip </span>
              <input
                type="tel"
                placeholder="Enter in number"
                name="costPerStrip"
                value={formData.costPerStrip}
                onChange={handleChange}
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="flex justify-center text-lg text-center w-full  my-4 ">
            <h1>OR</h1>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Cost/Vial</span>
              <input
                type="tel"
                placeholder="Enter in number"
                name="costPervial"
                value={formData.costPervial}
                onChange={handleChange}
                className="input input-bordered border-black w-80"
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
    </div>
  );
};

export default addmedicine;
