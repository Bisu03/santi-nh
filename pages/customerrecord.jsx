import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Heading from "../components/Heading";
import NavbarTwo from "../components/NavbarTwo";
import axios from "axios";
import LodingScreen from "../components/LodingScreen";

const customerrecord = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState([]);
  const [deleteLoding, setDeleteLoding] = useState(false);

  const getdata = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/customer-record?search=" + searchQuery
      );
      setLoading(false);
      setFetchData(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getdata();
  }, [setFetchData, searchQuery]);
  return (
    <>
      {" "}
      <NavbarTwo />
      <Heading title="All Customer Record" />
      <div className="flex justify-center w-full ">
        <div className="form-control pt-5 w-full">
          <div className="input-group justify-center w-full">
            <input
              type="search"
              name="search"
              placeholder="Search by Unique ID "
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
      <div className="overflow-x-auto h-screen bg-accent p-5 my-5 ">
        {!loading ? (
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>Unique Id</th>
                <th>name</th>
                <th>Gender</th>
                <th>Medical Case</th>
                <th>Billing Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <>
                {fetchData?.map((data, indx) => (
                  <tr key={data?._id}>
                    <th> {indx + 1} </th>
                    <td>{data?.uniqueId}</td>
                    <td>{data?.fullname}</td>
                    <td>{data?.gender}</td>
                    <td>{data?.medicalCase}</td>
                    <td>
                      {data?.billingStatus === "Done" ? (
                        <div className="badge badge-success gap-2">Done</div>
                      ) : (
                        <div className="badge badge-warning gap-2">Pending</div>
                      )}
                    </td>
                    <td>
                      <div className="dropdown dropdown-left ">
                        <label tabIndex={0} className="btn m-1">
                          Click
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-success rounded-box w-52  text-lg">
                          <li>
                            <a
                              target="_blank"
                              href={`/customerbill/${data?._id}`}>
                              Medicine bill
                            </a>
                          </li>
                          <li>
                            <a
                              target="_blank"
                              href={`/editcustomer/${data?._id}`}>
                              Update Record
                            </a>
                          </li>
                          <li>
                            <a
                              target="_blank"
                              href={`/customer-medicine/${data?._id}`}>
                              Add Medicine
                            </a>
                          </li>
                          <button
                            className={`btn ${deleteLoding ? "loading" : ""} `}
                            onClick={() => handleDelete(data?.admissionId)}>
                            Delete
                          </button>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            </tbody>
          </table>
        ) : (
          <LodingScreen />
        )}
      </div>
    </>
  );
};

customerrecord.adminRoute = true;
export default customerrecord;
