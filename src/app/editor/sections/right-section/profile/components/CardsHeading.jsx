import React from "react";

const CardsHeading = ({ name, icon }) => {
  return (
    <>
      <div className="flex  m-4 ">
        <div className="text-base font-semibold">{name}</div>
        <div className="pl-2">
          {" "}
          <img className=" h-5" src={icon} alt="" />
        </div>
      </div>
    </>
  );
};

export default CardsHeading;
