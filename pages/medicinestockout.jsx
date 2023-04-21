import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Heading from "../components/Heading";
import { toast } from "react-toastify";
import axios from "axios";

const medicinestockout = () => {
  const [getDate, setDate] = useState({
    fromdate: new Date().toISOString().substring(0, 10),
    todate: new Date().toISOString().substring(0, 10),
  });
  const [stockdata, setStockdata] = useState([]);
  const [loding, setLoding] = useState(false);

  const handleChange = (e) => {
    setDate({
      ...getDate,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    // e.preventDefault()
    setLoding(true);
    try {
      const { data } = await axios.get(
        "/api/medicinestockout?fromdate=" +
          getDate.fromdate +
          "&todate=" +
          getDate.todate
      );
      setStockdata(data);
      console.log(data);
      setLoding(false);
    } catch (error) {
      console.log(error);
      setLoding(false);
      toast.warn("something went wrong");
    }
  };

  useEffect(() => {
    handleSearch();
  }, [getDate]);

  return (
    <div>
      <Navbar />
      <Heading title="Medicine Stock Out" />

      <div className="flex flex-col w-full lg:flex-row mt-4">
        <input
          type="date"
          name="fromdate"
          value={getDate.fromdate}
          onChange={handleChange}
          className="grid flex-grow h-auto card bg-base-300 rounded-box place-items-center"
        />
        <div className="divider lg:divider-horizontal">To</div>
        <input
          type="date"
          name="todate"
          value={getDate.todate}
          onChange={handleChange}
          className="grid flex-grow h-auto card bg-base-300 rounded-box place-items-center"
        />
      </div>

      <div className="overflow-x-auto mt-4 ">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>ID</th>
              <th>Date OF Admin</th>
              <th>Release Date</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
              <td>Blue</td>
            </tr>
          </tbody>
        </table>

        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr className="active">
              <th></th>
              <th>Item Name</th>
              <th>Per Units Charge</th>
              <th>Units</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="active">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
              <td>Blue</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

medicinestockout.adminRoute = true;
export default medicinestockout;
