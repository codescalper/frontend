import { Switch } from "@material-tailwind/react";
import React from "react";

const SwitchGroup = ({ switchHead, switchDesc }) => {
  return (
    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2"> {switchHead} </h2>
        <Switch
          color="teal"
          // defaultChecked
          onClick={() => console.log("Switch ON/OFF")}
        />
      </div>
      <div className="w-4/5 opacity-75"> {switchDesc} </div>
    </div>
  );
};

export default SwitchGroup;
