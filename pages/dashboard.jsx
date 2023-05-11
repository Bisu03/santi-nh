import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import LodingScreen from "../components/LodingScreen";
import Navbar from "../components/Navbar";

const dashboard = () => {
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [dashData, setDashData] = useState([]);
  const [dashAdmited, setDashAdmited] = useState([]);
  const [dashDispatch, setDashDispatch] = useState([]);
  const [total, setTotal] = useState("");
  const [totalSpent, setTotalSpent] = useState("");
  const [getDate, setDate] = useState({
    fromdate: new Date().toISOString().substring(0, 10),
    todate: new Date().toISOString().substring(0, 10),
  });
  const [getdays, setGetdays] = useState("Todays");

  useEffect(() => {
    const getdata = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "/api/dailydata?fromdate=" +
            getDate.fromdate +
            "&todate=" +
            getDate.todate
        );
        console.log(data);
        setDashData(data);
        setDashAdmited(data.getadmission.length);
        setDashDispatch(data.getdeparture.length);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getdata();
  }, [getdays, setDate]);

  const handletoday = () => {
    setDate({
      fromdate: new Date().toISOString().substring(0, 10),
      todate: new Date().toISOString().substring(0, 10),
    });
  };
  const handleweek = () => {
    let currentDate = new Date();
    let firstday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 6
    )
      .toISOString()
      .substring(0, 10);

    setDate({
      fromdate: firstday,
      todate: new Date().toISOString().substring(0, 10),
    });
    console.log(getDate);
  };

  const handlemnth = () => {
    let now = new Date();
    let firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .substring(0, 10);

    setDate({
      fromdate: firstDay,
      todate: new Date().toISOString().substring(0, 10),
    });
    console.log(getDate);
  };

  useEffect(() => {
    let getTotal = 0;
    for (let index = 0; index < dashDispatch; index++) {
      const element = dashData.getdeparture[index];
      // console.log(element.billing.total.totalCharge)
      getTotal += element?.billing?.total?.totalCharge;
    }
    setTotal(getTotal);
    // setTotalSpent
    let getTotalSpent = 0;
    for (let index = 0; index < dashData?.getspent?.length; index++) {
      const element = dashData?.getspent[index];
      // console.log(element.billing.total.totalCharge)
      getTotalSpent += element?.amount;
    }
    setTotalSpent(getTotalSpent);
  }, [dashDispatch, getdays, getDate]);

  if (loading) {
    <LodingScreen />;
  }

  return (
    <div>
      <Navbar />
      <div className="stats shadow w-full rounded-none bg-green-100 mt-16 ">
        <div className="stat place-items-center">
          <div className="stat-title">Patient Admited</div>
          <div className="stat-value">{dashAdmited}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Patient Dispatched</div>
          <div className="stat-value text-secondary">{dashDispatch}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">{getdays} Income</div>
          <div className="stat-value">{total}</div>
        </div>
        {/* <div className="stat place-items-center">
          <div className="stat-title">{getdays} Spent</div>
          <div className="stat-value">{totalSpent}</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">Total Net Amount</div>
          <div className="stat-value">
            {" "}
            {total && totalSpent ? (
              <h2>{+total - +totalSpent}/-</h2>
            ) : (
              <h2>0/-</h2>
            )}
          </div>
        </div> */}
      </div>

      {/* <div className=" flex justify-center my-4 ">
        <div className="btn-group">
          <button onClick={handletoday} className="btn btn-active">
            Todays
          </button>
          <button onClick={handleweek} className="btn">
            Weeks
          </button>
          <button onClick={handlemnth} className="btn">
            Months
          </button>
        </div>
      </div> */}

      <div className="overflow-x-auto bg-accent p-5 my-5 ">
        <div className=" text-center font-bold text-base-100 mb-5 ">
          <p>Todays Patient Admit Record</p>
        </div>

        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              <th>Admission ID</th>
              <th>Name</th>
              <th>Phone No</th>
              <th>Gender</th>
              <th>Billing Status</th>
            </tr>
          </thead>
          <tbody>
            <>
              {dashData?.getadmission?.map(
                (patient, indx) =>
                  patient.billingStatus === "Pending" && (
                    <tr key={patient?._id}>
                      <th> {indx + 1} </th>
                      <td>{patient?.admissionId}</td>
                      <td>{patient?.patient?.fullname}</td>
                      <td>{patient?.patient?.contactNo}</td>
                      <td>{patient?.patient?.gender}</td>
                      <td>
                        <div className="badge badge-warning gap-2">Pending</div>
                      </td>
                    </tr>
                  )
              )}
            </>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto bg-accent p-5 my-5 ">
        <div className=" text-center font-bold text-base-100 mb-5 ">
          <p>Todays Patient Dispatched Record</p>
        </div>

        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              <th>Admission ID</th>
              <th>Name</th>
              <th>Phone No</th>
              <th>Gender</th>
              <th>Billing Status</th>
            </tr>
          </thead>
          <tbody>
            <>
              {dashData?.getdeparture?.map(
                (patient, indx) =>
                  patient.billingStatus === "Done" && (
                    <tr key={patient?._id}>
                      <th> {indx + 1} </th>
                      <td>{patient?.admissionId}</td>
                      <td>{patient?.patient?.fullname}</td>
                      <td>{patient?.patient?.contactNo}</td>
                      <td>{patient?.patient?.gender}</td>
                      <td>
                        <div className="badge badge-success gap-2">
                          {patient.billingStatus}
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </>
          </tbody>
        </table>
      </div>

      {/* <div className="overflow-x-auto bg-accent p-5 my-5 ">
        <div className=" text-center font-bold text-base-100 mb-5 ">
          <p>Todays Spent</p>
        </div>

        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              <th>Date Of Entry</th>
              <th>Item Name</th>
              <th>Item Charge</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div> */}
    </div>
  );
};

dashboard.adminRoute = true;
export default dashboard;
