// import { Switch } from "@material-tailwind/react";
import React, { useContext } from "react";
import { Context } from "../../../../../../context/ContextProvider";
import { Switch } from "@headlessui/react";

const SwitchGroup = ({ switchHead, switchDesc, mintOption }) => {
  const { enabled, setEnabled } = useContext(Context);

  return (
    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2"> {switchHead} </h2>
        <Switch
          color="teal"
          // defaultChecked
          onClick={() => {
            console.log("Clicked")
            console.log( mintOption )
            setEnabled({ mintOption  : !mintOption })
          }
        }
        />
      </div>
      <div className="w-4/5 opacity-75"> {switchDesc} </div>
    </div>
  );
};

export default SwitchGroup;
