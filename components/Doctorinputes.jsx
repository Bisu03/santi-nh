import React from "react";

const Doctorinputes = ({ doctor, setDoctorData }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...doctor.items];
    list[index][name] = value;
    list[index].total =
      list[index].numberofvisit * list[index].chargepervisit || 0;
    let total = calculateTotal(list);
    setDoctorData({ items: list, total });
  };

  const handleRemoveItem = (index) => {
    const list = [...doctor.items];
    list.splice(index, 1);
    let total = calculateTotal(list);
    setDoctorData({ items: list, total });
  };

  const calculateTotal = (items) => {
    let total = 0;

    items.forEach((item) => {
      total += parseInt(item.total) || 0;
    });

    return total;
  };

  const handleAddItem = () => {
    setDoctorData({
      ...doctor,
      items: [
        ...doctor.items,
        {
          doctorname: "",
          numberofvisit: "",
          chargepervisit: "",
          total: "",
        },
      ],
    });
  };
  return (
    <div>
      {doctor?.items?.map((item, index) => (
        <div key={index}>
          <>
            <div className="flex justify-center w-auto my-6 ">
              <div className=" p-5 bg-red-100 rounded-md  ">
                {index + 1}
                <div className="form-control mt-4 w-auto ">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold ">
                      Doctor Name
                    </span>
                    <input
                      name="doctorName"
                      type="text"
                      placeholder="Doctor Details"
                      value={item.doctorName}
                      className="input input-bordered border-black w-[400px]"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </label>
                </div>
                <div className="form-control mt-4">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold">
                      Charge / Day
                    </span>
                    <input
                      type="tel"
                      name="chargepervisit"
                      placeholder="Charge / Day"
                      value={item.chargepervisit}
                      className="input input-bordered border-black  w-[400px]"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </label>
                </div>
                <div className="form-control mt-4">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold">
                      Number Of visit
                    </span>
                    <input
                      type="tel"
                      name="numberofvisit"
                      placeholder=" Number Of visit"
                      value={item.numberofvisit}
                      className="input input-bordered border-black  w-[400px]"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </label>
                </div>
                <div className="form-control mt-4">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold">Total</span>
                    <input
                      type="tel"
                      name="total"
                      placeholder="Total"
                      value={item.total}
                      className="input input-bordered border-black  w-[400px]"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </label>
                </div>
                <div className="form-control mt-4">
                  <label className="input-group">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="input input-bordered border-black bg-error text-base-100 text-xl border-none rounded  w-full">
                      Remove
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </>
        </div>
      ))}

      <div className="flex justify-center w-auto my-6 ">
        <div className="btn-group">
          <button onClick={handleAddItem} className="btn">
            Add Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default Doctorinputes;
