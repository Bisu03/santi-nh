import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CgSearch } from "react-icons/cg";
import {
  AiFillDelete,
  AiFillMedicineBox,
  AiFillMinusSquare,
  AiFillPlusSquare,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import LodingScreen from "../../components/LodingScreen";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Heading from "../../components/Heading";
import { toast } from "react-toastify";

const addmedicinetopatient = () => {
  const router = useRouter();
  const { addmedicinetopatient } = router.query;
  // console.log(addmedicinetopatient)
  const [loding, setLoding] = useState(false);
  const [isMedAdded, setIsMedAdded] = useState(false);
  const [isMedAddedId, setIsMedAddedId] = useState("");
  const [medSave, setMedSave] = useState(false);
  const [getLoding, seGettloding] = useState(false);
  const [admissionData, setAdmissionData] = useState([]);
  const [medData, setMedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [AddType, setAddType] = useState("In List");
  const [Cart, setCart] = useState({});
  const innitialform = {
    id: Math.random().toString(36).substr(2, 5),
    expiry: "",
    medicineName: "",
    batchNo: "",
    brand: "",
    costPerStrip: "",
    costPerVial: "",
  };
  const [manualEntry, setmanualEntry] = useState(innitialform);

  const [medicineCharges, setMedicineCharges] = useState({
    items: [{}],
    total: "",
  });
  const [total, setTotal] = useState({
    totalCharge: "",
  });

  console.log(Cart);

  const fetchDetailsByAdmissionID = () => {
    setLoding(true);
    axios
      .get(`/api/admission-details/${addmedicinetopatient}`)
      .then(({ data }) => {
        console.log(data);
        setAdmissionData(data);
        setLoding(false);
      })
      .catch((err) => {
        console.error(err);
        setLoding(false);
      });
  };

  useEffect(() => {
    fetchDetailsByAdmissionID();
  }, [addmedicinetopatient]);

  const getMedicine = async () => {
    try {
      seGettloding(true);
      const { data } = await axios.get(
        "/api/getmedicine?search=" + searchQuery
      );
      setMedData(data);
      seGettloding(false);
    } catch (error) {
      console.log(error);
      seGettloding(false);
    }
  };

  const handleAdd = (
    id,
    expiry,
    medicineName,
    batchNo,
    brand,
    costPerStrip,
    costPervial,
    quantity,
    total
  ) => {
    // console.log(id);
    let newCart = Cart;
    if (id in Cart) {
      newCart[id].quantity = Cart[id].quantity + quantity;
      newCart[id].total =
        newCart[id].quantity * Cart[id].costPerStrip ||
        newCart[id].quantity * Cart[id].costPervial;
    } else {
      newCart[id] = {
        id,
        expiry,
        medicineName,
        batchNo,
        brand,
        costPerStrip,
        costPervial,
        quantity: 1,
        total: quantity * costPervial || costPerStrip,
      };
      setmanualEntry(innitialform);
    }
    setCart({ ...newCart });
    let subTotal = 0;
    let key = Object.keys(Cart);
    for (let index = 0; index < key.length; index++) {
      if (Cart[key[index]].costPervial) {
        subTotal += Cart[key[index]].costPervial * Cart[key[index]].quantity;
      } else {
        subTotal += Cart[key[index]].costPerStrip * Cart[key[index]].quantity;
      }
    }

    setMedicineCharges({ items: Cart, total: subTotal });
  };

  const removeItem = (
    id,
    expiry,
    medicineName,
    batchNo,
    brand,
    costPerStrip,
    costPervial,
    quantity
  ) => {
    let newCart = Cart;
    if (id in Cart) {
      newCart[id].quantity = Cart[id].quantity - quantity;
    }
    if (newCart[id].quantity <= 0) {
      delete newCart[id];
    }
    setCart({ ...newCart });
    let subTotal = 0;
    let key = Object.keys(Cart);
    for (let index = 0; index < key.length; index++) {
      if (Cart[key[index]].costPervial) {
        subTotal += Cart[key[index]].costPervial * Cart[key[index]].quantity;
      } else {
        subTotal += Cart[key[index]].costPerStrip * Cart[key[index]].quantity;
      }
    }

    setMedicineCharges({ items: Cart, total: subTotal });
  };

  useEffect(() => {
    getMedicine();

    let totalCharge = parseInt(medicineCharges?.total) || 0;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    medicineCharges,
    setAddType,
    setTotal,
    addmedicinetopatient,
  ]);

  useEffect(() => {
    console.log("run effect");

    const fetchDetailsByAdmissionID = async () => {
      const { data } = await axios.get(
        `/api/findmedbill/${addmedicinetopatient}`
      );

      try {
        console.log(data);
        setIsMedAddedId(data._id || {});
        setIsMedAdded(data.isMedAdd || false);
        setCart(data?.medicineCharges?.items || {});
        setMedicineCharges(data?.billing?.medicineCharges || {});
        setTimeout(() => {
          setTotal({
            totalCharge: data?.total?.totalCharge,
          });
        }, 100);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailsByAdmissionID();
  }, [setCart, setMedicineCharges, setTotal, addmedicinetopatient]);

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
    ``;
    netPayableAmount += parseInt(totalLocal.sgst) || 0;
    netPayableAmount += parseInt(totalLocal.tds) || 0;

    setTotal({
      ...total,
      [name]: value,
      payableAmount: payableAmount,
      netPayableAmount: netPayableAmount,
    });
  };

  const handleSubmit = async () => {
    setMedSave(true);

    if (isMedAdded === true) {
      try {
        await axios.put("/api/updatepatientmed", {
          id: isMedAddedId,
          medicineCharges,
          total,
        });
        setMedSave(false);
        router.push(`/medicinebill/${addmedicinetopatient}`);
      } catch (error) {
        setMedSave(false);
        toast.warn(error?.response?.data?.message);
        console.log(error);
      }
    } else {
      try {
        await axios.post("/api/addpatientmed", {
          admissionId: addmedicinetopatient,
          patient: admissionData.patient._id,
          admission: admissionData._id,
          billingId: admissionData.billing._id,
          medicineCharges,
          total,
        });
        setMedSave(false);
        router.push(`/medicinebill/${addmedicinetopatient}`);
      } catch (error) {
        setMedSave(false);
        toast.warn(error?.response?.data?.message);
        console.log(error);
      }
    }
  };
  return (
    <div>
      <Navbar />
      <Heading title="Add Medicine To Patient" />
      <table className=" container table table-compact w-full my-4 ">
        <thead>
          <tr>
            <th>Admission Id- {admissionData?.admissionId}</th>
            <th>Name- {admissionData?.patient?.fullname}</th>
            <th>Gender- {admissionData?.patient?.gender}</th>
            <th>Age- {admissionData?.age}</th>
            <th>Medical Case- {admissionData?.medicalCase}</th>
          </tr>
        </thead>
      </table>

      <div className="form-control">
        <div className="input-group">
          <select
            name="addType"
            onChange={(e) => setAddType(e.target.value)}
            className="select border select-bordered bg-warning text-base-100 ">
            <option>In List</option>
            <option>Not In List</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col w-full lg:flex-row ">
        <div className="grid flex-grow card bg-base-300 rounded-none place-items-center h-[500px] overflow-y-scroll ">
          {AddType === "In List" ? (
            <>
              <div className="flex justify-center w-full ">
                <div className="form-control w-full my-2">
                  <div className="input-group justify-center w-full">
                    <input
                      type="search"
                      name="search"
                      placeholder="Search by Name or Batch No. "
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input input-bordered w-96 text-black "
                    />
                    <button className="btn btn-square">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {medData.map((data) => (
                <div
                  key={data._id}
                  className="flex flex-wrap w-full justify-evenly bg-primary my-4  ">
                  <button className="btn gap-2 m-2 ">
                    Medicine name
                    <div className="badge badge-secondary">
                      {data.medicineName}
                    </div>
                  </button>
                  <button className="btn gap-2 m-2 ">
                    Expiry Date
                    <div className="badge badge-secondary">
                      {data.expiry.split("-").reverse().join("-")}
                    </div>
                  </button>
                  <button className="btn gap-2 m-2 ">
                    Batch no.
                    <div className="badge badge-secondary">{data.batchNo}</div>
                  </button>
                  <button className="btn gap-2 m-2 ">
                    Brand
                    <div className="badge badge-secondary">{data.brand}</div>
                  </button>
                  {data.costPerStrip ? (
                    <button className="btn gap-2 m-2 ">
                      Cost/Strip
                      <div className="badge badge-secondary">
                        {data.costPerStrip}
                      </div>
                    </button>
                  ) : (
                    <button className="btn gap-2 m-2 ">
                      Cost/Vial
                      <div className="badge badge-secondary">
                        {data.costPervial}
                      </div>
                    </button>
                  )}
                  <button className="btn gap-2 m-2 ">
                    Quantity
                    <div className="badge badge-secondary">{data.quantity}</div>
                  </button>
                  <button
                    onClick={() => {
                      handleAdd(
                        data._id,
                        data.expiry,
                        data.medicineName,
                        data.batchNo,
                        data.brand,
                        data.costPerStrip,
                        data.costPervial,
                        1,
                        0
                      );
                    }}
                    className="btn btn-warning gap-2 m-2 ">
                    Add
                  </button>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className=" p-5 bg-red-100 rounded-md  ">
                <div className="form-control">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold">
                      Medicine Name
                    </span>
                    <input
                      type="text"
                      name="medicineName"
                      placeholder="Medicine Name."
                      value={manualEntry.medicineName}
                      onChange={(e) =>
                        setmanualEntry({
                          ...manualEntry,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="input input-bordered border-black w-80"
                    />
                  </label>
                </div>
                <div className="form-control mt-4 ">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold ">
                      Expiry Date
                    </span>
                    <input
                      name="expiry"
                      type="date"
                      value={manualEntry.expiry}
                      onChange={(e) =>
                        setmanualEntry({
                          ...manualEntry,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="input input-bordered border-black w-80"
                    />
                  </label>
                </div>

                <div className="form-control mt-4">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold ">
                      Batch Number
                    </span>
                    <input
                      type="text"
                      name="batchNo"
                      placeholder="Batch no."
                      value={manualEntry.batchNo}
                      onChange={(e) =>
                        setmanualEntry({
                          ...manualEntry,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="input input-bordered border-black w-80"
                    />
                  </label>
                </div>

                <div className="form-control mt-4">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold">
                      Brand Name
                    </span>
                    <input
                      type="text"
                      name="brand"
                      placeholder="Brand"
                      value={manualEntry.brand}
                      onChange={(e) =>
                        setmanualEntry({
                          ...manualEntry,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="input input-bordered border-black w-80"
                    />
                  </label>
                </div>

                <div className="btn btn-block  btn-warning rounded-none cursor-default text-lg my-4 ">
                  Cost
                </div>

                <div className="form-control mt-4">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold">
                      Cost/Strip{" "}
                    </span>
                    <input
                      type="number"
                      name="costPerStrip"
                      placeholder="Cost/Strip"
                      value={manualEntry.costPerStrip}
                      onChange={(e) =>
                        setmanualEntry({
                          ...manualEntry,
                          [e.target.name]: e.target.value,
                        })
                      }
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
                      name="costPerVial"
                      type="number"
                      placeholder="Cost/vial"
                      value={manualEntry.costPerVial}
                      onChange={(e) =>
                        setmanualEntry({
                          ...manualEntry,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="input input-bordered border-black w-80"
                    />
                  </label>
                </div>

                <div className="flex justify-center mt-5  ">
                  <button
                    onClick={() => {
                      handleAdd(
                        manualEntry.id,
                        manualEntry.expiry,
                        manualEntry.medicineName,
                        manualEntry.batchNo,
                        manualEntry.brand,
                        manualEntry.costPerStrip,
                        manualEntry.costPerVial,
                        1,
                        0
                      );
                    }}
                    className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ${
                      loding ? "loading" : ""
                    } `}>
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid flex-grow card bg-success rounded-box place-items-center h-[500px] overflow-y-scroll ">
          {Object.keys(Cart || {})
            ?.reverse()
            .map((data) => (
              <div
                key={data}
                className="flex flex-wrap w-full justify-evenly bg-primary my-4  ">
                <button className="btn gap-2 m-2 ">
                  Medicine name
                  <div className="badge badge-secondary">
                    {Cart[data].medicineName}
                  </div>
                </button>
                <button className="btn gap-2 m-2 ">
                  Expiry Date
                  <div className="badge badge-secondary">
                    {Cart[data].expiry.split("-").reverse().join("-")}
                  </div>
                </button>
                <button className="btn gap-2 m-2 ">
                  Batch no.
                  <div className="badge badge-secondary">
                    {" "}
                    {Cart[data].batchNo}
                  </div>
                </button>
                <button className="btn gap-2 m-2 ">
                  Brand
                  <div className="badge badge-secondary">
                    {Cart[data].brand}
                  </div>
                </button>
                {Cart[data].costPerStrip ? (
                  <button className="btn gap-2 m-2 ">
                    Cost/Strip
                    <div className="badge badge-secondary">
                      {Cart[data].costPerStrip}
                    </div>
                  </button>
                ) : (
                  <button className="btn gap-2 m-2 ">
                    Cost/Vial
                    <div className="badge badge-secondary">
                      {Cart[data].costPervial}
                    </div>
                  </button>
                )}
                <div className=" text-center bg-accent btn-block p-4  gap-2 m-2 ">
                  Quantity
                  <button
                    onClick={() => {
                      handleAdd(
                        data,
                        Cart[data].expiry,
                        Cart[data].medicineName,
                        Cart[data].batchNo,
                        Cart[data].brand,
                        Cart[data].costPerStrip,
                        Cart[data].costPervial,
                        1,
                        0
                      );
                    }}
                    className="btn mx-4 badge badge-error ">
                    {" "}
                    <AiOutlinePlus className="h-4 w-4" />{" "}
                  </button>
                  <div className="badge badge-secondary p-4 ">
                    {Cart[data].quantity}
                  </div>
                  <button
                    onClick={() => {
                      removeItem(
                        data,
                        Cart[data].expiry,
                        Cart[data].medicineName,
                        Cart[data].batchNo,
                        Cart[data].brand,
                        Cart[data].costPerStrip,
                        Cart[data].costPervial,
                        1,
                        0
                      );
                    }}
                    className="btn mx-4 badge badge-error">
                    {" "}
                    <AiOutlineMinus className="h-4 w-4" />{" "}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <button className="btn btn-block btn-error my-4 rounded-none text-lg ">
        Total: {total?.totalCharge}/-
      </button>
      <div className="flex justify-center w-full my-4 ">
        <button
          className={`btn btn-info mr-2 ${medSave ? "loading" : ""} `}
          onClick={handleSubmit}>
          Save
        </button>
        <Link href="/patientrecord" className="btn btn-info">
          Cancel
        </Link>
      </div>
    </div>
  );
};

addmedicinetopatient.adminRoute = true;
export default addmedicinetopatient;
