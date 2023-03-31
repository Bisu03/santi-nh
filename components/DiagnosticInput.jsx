import React, { useState } from "react";

const DiagnosticInput = ({ diagData, setDiagData }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...diagData.items];
    list[index][name] = value;
    list[index].total = list[index].cost;
    let total = calculateTotal(list);
    setDiagData({ items: list, total });
  };

  const handleRemoveItem = (index) => {
    const list = [...diagData.items];
    list.splice(index, 1);
    let total = calculateTotal(list);
    setDiagData({ items: list, total });
  };

  const calculateTotal = (items) => {
    let total = 0;

    items.forEach((item) => {
      total += parseInt(item.total) || 0;
    });

    return total;
  };

  const handleAddItem = () => {
    setDiagData({
      ...diagData,
      items: [
        ...diagData.items,
        {
          testName: "",
          testDetails: "",
          cost: "",
          drReferral: "",
          total: "",
        },
      ],
    });
  };
  const handleAddItemManual = () => {
    setDiagData({
      ...diagData,
      items: [
        ...diagData.items,
        {
          manual: true,
          testName: "",
          testDetails: "",
          cost: "",
          drReferral: "",
          total: "",
        },
      ],
    });
  };

  return (
    <div>
      {diagData?.items?.map((item, index) => (
        <div key={index}>
          {item.manual ? (
            <>
              <div className="flex justify-center w-auto my-6 ">
                <div className=" p-5 bg-red-100 rounded-md  ">
                  {index + 1}
                  <div className="form-control mt-4 w-auto ">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold ">
                        Test Name
                      </span>
                      <select
                        onChange={(e) => handleChange(e, index)}
                        name="testName"
                        className="input input-bordered border-black  w-[400px] text-xl ">
                        <option selected>Select</option>
                        <option value="General">General</option>
                        <option value="Female">Female</option>
                        <option value="Others"> Others</option>
                      </select>
                    </label>
                  </div>

                  <div className="form-control mt-4">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold">
                        Test Details
                      </span>
                      <input
                        name="testDetails"
                        type="text"
                        placeholder="Test Details"
                        value={item.testDetails}
                        className="input input-bordered border-black w-[400px]"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </label>
                  </div>
                  <div className="form-control mt-4">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold">Cost</span>
                      <input
                        type="tel"
                        name="cost"
                        placeholder="Cost"
                        value={item.cost}
                        className="input input-bordered border-black  w-[400px]"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </label>
                  </div>
                  <div className="form-control mt-4">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold">
                        Dr Refferal
                      </span>
                      <input
                        name="drReferral"
                        type="text"
                        placeholder="Dr Referral"
                        value={item.drReferral}
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
          ) : (
            <>
              <div className="flex justify-center w-auto my-6 ">
                <div className=" p-5 bg-red-100 rounded-md  ">
                  {index + 1}
                  <div className="form-control mt-4 w-auto ">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold ">
                        Test Name
                      </span>
                      <input
                        name="testName"
                        type="text"
                        placeholder="Test Details"
                        value={item.testName}
                        className="input input-bordered border-black w-[400px]"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </label>
                  </div>

                  <div className="form-control mt-4">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold">
                        Test Details
                      </span>
                      <input
                        name="testDetails"
                        type="text"
                        placeholder="Test Details"
                        value={item.testDetails}
                        className="input input-bordered border-black w-[400px]"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </label>
                  </div>
                  <div className="form-control mt-4">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold">Cost</span>
                      <input
                        type="tel"
                        name="cost"
                        placeholder="Cost"
                        value={item.cost}
                        className="input input-bordered border-black  w-[400px]"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </label>
                  </div>
                  <div className="form-control mt-4">
                    <label className="input-group">
                      <span className="w-60  uppercase font-bold">
                        Dr Refferal
                      </span>
                      <input
                        name="drReferral"
                        type="text"
                        placeholder="Dr Referral"
                        value={item.drReferral}
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
          )}
        </div>
      ))}

      <div className="flex justify-center w-auto my-6 ">
        <div className="btn-group">
          <button onClick={handleAddItemManual} className="btn btn-active">
            Add Another
          </button>
          <button onClick={handleAddItem} className="btn">
            Add Another(not in list)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticInput;
