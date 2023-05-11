import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useEffect, useState } from "react";
import axios from "axios";
import LodingScreen from "../components/LodingScreen";
import { toast } from "react-toastify";

const patientrecord = () => {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState([]);
  const [deleteLoding, setDeleteLoding] = useState(false);

  const getdata = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/patient-records?search=" + searchQuery
      );
      setLoading(false);
      console.log(data);
      setFetchData(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDelete = (admissionID) => {
    setDeleteLoding(true);
    axios
      .delete(`/api/delete-admission/${admissionID}`)
      .then((data) => {
        setDeleteLoding(false);
        location.reload();
        toast.success("Admission record deleted successfully");
      })
      .catch((err) => {
        setDeleteLoding(false);
        toast.warn("Not allowed : " + err.message);
      });
  };

  useEffect(() => {
    getdata();
  }, [setFetchData, searchQuery]);

  return (
    <>
      <Navbar />
      <Heading title="All Patient Record" />

      <div className="flex justify-center w-full ">
        <div className="form-control pt-5 w-full">
          <div className="input-group justify-center w-full">
            <input
              type="search"
              name="search"
              placeholder="Search by Admission ID "
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
                <th>Admission Id</th>
                <th>name</th>
                <th>Gender</th>
                <th>Disease</th>
                <th>Doctor Name</th>
                <th>Bed Type</th>
                <th>Bed Number</th>
                <th>Admission Type</th>
                <th>Date Of Admission</th>
                <th>Date Of Discharge</th>
                <th>Billing Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <>
                {fetchData?.map((patient, indx) => (
                  <tr key={patient?._id}>
                    <th> {indx + 1} </th>
                    <td>{patient?.admissionId}</td>
                    <td>{patient?.patient?.fullname}</td>
                    <td>{patient?.patient?.gender}</td>
                    <td>{patient?.medicalCase}</td>
                    <td>{patient?.drrefferal}</td>
                    <td>{patient?.bedtype}</td>
                    <td>{patient?.bedno}</td>
                    <td>{patient?.admissiontype}</td>
                    <td>{patient?.dateOfAdmission}</td>
                    <td>{patient?.dateOfDeparture}</td>
                    <td>
                      {patient?.billingStatus === "Done" ? (
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
                              href={`/printadmission/${patient?.admissionId}`}>
                              Print Receipt
                            </a>
                          </li>
                          <li>
                            <a
                              target="_blank"
                              href={`/admission-details/${patient?.admissionId}`}>
                              Print Bill
                            </a>
                          </li>
                          <li>
                            <a
                              target="_blank"
                              href={`/advancebill/${patient?.admissionId}`}>
                              Advance Bill
                            </a>
                          </li>
                          {/* <li>
                            <a
                              target="_blank"
                              href={`/medicinebill/${patient?.admissionId}`}>
                              Medicine bill
                            </a>
                          </li> */}
                          <li>
                            <a
                              target="_blank"
                              href={`/edit-admission/${patient?.admissionId}`}>
                              Update Record
                            </a>
                          </li>
                          {/* <li>
                            <a
                              target="_blank"
                              href={`/addmedicinetopatient/${patient?.admissionId}`}>
                              Add Medicine
                            </a>
                          </li> */}
                          <li>
                            <a
                              target="_blank"
                              href={`/allfilesupload/${patient?._id}`}>
                              File Upload
                            </a>
                          </li>
                          {session?.user?.isSuperAdmin ? (
                            <button
                              className={`btn ${
                                deleteLoding ? "loading" : ""
                              } `}
                              onClick={() =>
                                handleDelete(patient?.admissionId)
                              }>
                              Delete
                            </button>
                          ) : undefined}
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

patientrecord.adminRoute = true;
export default patientrecord;
