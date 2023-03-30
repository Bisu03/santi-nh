import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Heading from "../components/Heading";
import LodingScreen from "../components/LodingScreen";
import Navbar from "../components/Navbar";

const medicinelist = () => {
  const [loding, setloding] = useState(false);
  const { data: session, status } = useSession();
  const [medData, setMedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [btnDeleteLoding, setBtnDeleteLoding] = useState(false);

  const getMedicine = async () => {
    try {
      setloding(true);
      const { data } = await axios.get(
        "/api/getmedicine?search=" + searchQuery
      );
      setMedData(data);
      setloding(false);
    } catch (error) {
      // console.log(error);
      toast.warn(error?.response?.data?.message);
      setloding(false);
    }
  };
  useEffect(() => {
    getMedicine();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    // console.log(id);

    setBtnDeleteLoding(true);
    await axios
      .put(`/api/deletemedicine/` + id)
      .then(({ data }) => {
        console.log(data);
        toast.success("medicine deleted");

        setBtnDeleteLoding(false);
        location.reload();
      })
      .catch((err) => {
        setBtnDeleteLoding(false);
        toast.warn(err?.response?.data?.message);
      });
  };

  return (
    <div>
      <Navbar />
      <Heading title="All Medicine List" />

      <div className="flex justify-center w-full ">
        <div className="form-control pt-5 w-full">
          <div className="input-group justify-center w-full">
            <input
              type="search"
              name="search"
              placeholder="Search medicine name or Batch no."
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

      <div className="overflow-x-auto bg-accent p-5 my-5 ">
        {!loding ? (
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>Expiry Date</th>
                <th>Medicine name</th>
                <th>Batch no</th>
                <th>Brand </th>
                <th>Cost/Strip</th>
                <th>Cost/Vial </th>
                <th>Quantity </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {medData?.map((indx, cnt) => (
                <>
                  <tr key={indx._id}>
                    <th>{cnt + 1}</th>
                    <td>{indx.expiry.split("-").reverse().join("-")}</td>
                    <td>{indx.medicineName}</td>
                    <td>{indx.batchNo}</td>
                    <td>{indx.brand}</td>
                    <td> {indx.costPerStrip ? indx.costPerStrip : "-"}</td>
                    <td>{indx.costPervial ? indx.costPervial : "-"}</td>
                    <td>{indx.quantity}</td>

                    <td>
                      <div className="dropdown dropdown-left ">
                        <label tabIndex={0} className="btn m-1">
                          Click
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-success rounded-box w-52  text-lg text-center">
                          <li>
                            <a
                              target="_blank"
                              href={`/editmedicine/${indx._id}`}>
                              Edit
                            </a>
                          </li>
                          <button
                            onClick={() => handleDelete(indx._id)}
                            className={` btn ${
                              btnDeleteLoding ? "loading" : ""
                            } `}>
                            Delete
                          </button>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        ) : (
          <LodingScreen />
        )}
      </div>
    </div>
  );
};

export default medicinelist;
