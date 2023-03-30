import React from "react";

const SpecialNeedsInput = ({ itemData, setItemData }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...itemData.items];
    list[index][name] = value;
    list[index].total = list[index].hourPerDay * list[index].ratePerHour || 0;
    let total = calculateTotal(list);
    setItemData({ items: list, total });
  };

  const handleRemoveItem = (index) => {
    const list = [...itemData.items];
    list.splice(index, 1);
    let total = calculateTotal(list);
    setItemData({ items: list, total });
  };

  const calculateTotal = (items) => {
    let total = 0;

    items.forEach((item) => {
      total += parseInt(item.total) || 0;
    });

    return total;
  };

  const handleAddItem = () => {
    setItemData({
      ...itemData,
      items: [
        ...itemData.items,
        {
          itemName: "",
          hourPerDay: "",
          ratePerHour: "",
          total: "",
        },
      ],
    });
  };

  const handleAddItemManual = () => {
    setItemData({
      ...itemData,
      items: [
        ...itemData.items,
        {
          manual: true,
          itemName: "",
          hourPerDay: "",
          ratePerHour: "",
          total: "",
        },
      ],
    });
  };

  return (
    <div>
      {itemData?.items?.map((item, index) => (
        <div key={index}>
          <div className="flex  justify-center w-auto my-6 ">
            <div className=" p-5 bg-red-100 rounded-md  ">
              {index + 1}
              {item?.manual ? (
                <div className="form-control mt-4 w-auto ">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold ">
                      Select Item
                    </span>
                    <select
                      name="itemName"
                      value={item.itemName}
                      onChange={(e) => handleChange(e, index)}
                      className="input input-bordered border-black  w-[400px] text-xl ">
                      <option selected>Select</option>
                      <option value="General">General</option>
                      <option value="Female">Female</option>
                      <option value="Others"> Others</option>
                    </select>
                  </label>
                </div>
              ) : (
                <div className="form-control mt-4">
                  <label className="input-group">
                    <span className="w-60  uppercase font-bold">Item name</span>
                    <input
                      name="itemName"
                      type="text"
                      placeholder="Item name"
                      value={item.itemName}
                      onChange={(e) => handleChange(e, index)}
                      className="input input-bordered border-black  w-[400px]"
                    />
                  </label>
                </div>
              )}
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">
                    Hour Per Day{" "}
                  </span>
                  <input
                    name="hourPerDay"
                    type="number"
                    placeholder="Hour/Day"
                    value={item.hourPerDay}
                    onChange={(e) => handleChange(e, index)}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Rate / hour</span>
                  <input
                    name="ratePerHour"
                    type="number"
                    placeholder="Rate/hour"
                    value={item.ratePerHour}
                    onChange={(e) => handleChange(e, index)}
                    className="input input-bordered border-black  w-[400px]"
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="input-group">
                  <span className="w-60  uppercase font-bold">Total</span>
                  <input
                    type="number"
                    name="total"
                    placeholder="Total charge"
                    value={item.total}
                    onChange={(e) => handleChange(e, index)}
                    className="input input-bordered border-black  w-[400px]"
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

export default SpecialNeedsInput;
