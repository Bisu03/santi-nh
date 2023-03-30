import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Heading from "../../components/Heading";
import LodingScreen from "../../components/LodingScreen";
import Navbar from "../../components/Navbar";

const Editmedicine = () => {
  const router = useRouter();
  const { editmedicine } = router.query;
  //   console.log(editmedicine);
  const initialData = {
    expiry: "",
    medicineName: "",
    batchNo: "",
    brand: "",
    costPerStrip: "",
    costPervial: "",
    quantity: "",
  };

  const [loding, setloding] = useState(false);
  const [lodingUpdate, setLodingUpdate] = useState(false);

  const [formData, setFormData] = useState({
    expiry: "",
    medicineName: "",
    batchNo: "",
    brand: "",
    costPerStrip: "",
    costPervial: "",
    quantity: "",
  });
  const [extraquantity, setExtraquantity] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getMedicine = async () => {
    try {
      setloding(true);
      const { data } = await axios.get(`/api/getmedicinebyid/` + editmedicine);
      setFormData(data);
      setloding(false);
    } catch (error) {
      console.log(error);
      //   toast.warn(error?.response?.data?.message);
      setloding(false);
    }
  };
  useEffect(() => {
    getMedicine();
  }, [editmedicine]);

  let newquantity = +extraquantity + formData.quantity;

  if (formData.costPerStrip) {
    var totalamount = +formData.costPerStrip * +newquantity;
  } else {
    var totalamount = +formData.costPervial * +newquantity;
  }

  const handleSubmit = async () => {
    const {
      expiry,
      medicineName,
      batchNo,
      brand,
      costPerStrip,
      costPervial,
      quantity,
    } = formData;
    try {
      setLodingUpdate(true);
      const { data } = await axios.put("/api/updatemedicine/" + editmedicine, {
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        quantity: newquantity,
      });
      await axios.put("/api/updatestockin", {
        medicineId: editmedicine,
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        presentquantity: formData?.quantity,
        addedquantity: extraquantity,
        total: totalamount,
        dateOfadd: new Date().toISOString().substring(0, 10),
      });
      toast.success("medicine update successfully");
      console.log(data);
      setLodingUpdate(false);
      setFormData(initialData);
      router.push(`/medicinelist`);
    } catch (error) {
      console.log(error);
      setLodingUpdate(false);
      alert(error?.response?.data?.message);
    }
  };

  if (loding) {
    return <LodingScreen />;
  }

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
                value={formData?.medicineName}
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
                value={formData?.expiry}
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
                value={formData?.batchNo}
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
                value={formData?.brand}
                onChange={handleChange}
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">
                Present Quantity
              </span>
              <input
                type="tel"
                name="quantity"
                readOnly
                value={formData?.quantity}
                onChange={handleChange}
                placeholder="Enter in number"
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="form-control mt-4">
            <label className="input-group">
              <span className="w-60  uppercase font-bold">Add Quantity</span>
              <input
                type="tel"
                name="quantity"
                value={extraquantity}
                onChange={(e) => setExtraquantity(e.target.value)}
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
                value={formData?.costPerStrip}
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
                value={formData?.costPervial}
                onChange={handleChange}
                className="input input-bordered border-black w-80"
              />
            </label>
          </div>

          <div className="flex justify-center mt-5  ">
            <button
              onClick={handleSubmit}
              className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ${
                lodingUpdate ? "loading" : ""
              } `}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editmedicine;
