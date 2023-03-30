import React from "react";

const Heading = ({ title }) => {
  return (
    <div>
      <div className="hero bg-base-200 mt-16 ">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
