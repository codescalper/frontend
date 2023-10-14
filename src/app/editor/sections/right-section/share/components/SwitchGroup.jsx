// import { Switch } from "@material-tailwind/react";
import React, { useContext } from "react";
import { Context } from "../../../../../../context/ContextProvider";
import { Switch } from "@headlessui/react";

const SwitchGroup = ({ switchHead, switchDesc, mintOption }) => {
  const { enabled, setEnabled } = useContext(Context);

  return (
    // <div className="mb-4 m-4">
    //   <div className="flex justify-between">
    //     <h2 className="text-lg mb-2"> {switchHead} </h2>
    //     <Switch
    //       color="teal"
    //       // defaultChecked
    //       onClick={() => {
    //         console.log("Clicked")
    //         console.log( mintOption )
    //         setEnabled({ mintOption  : !mintOption })
    //       }
    //     }
    //     />
    //   </div>
    //   <div className="w-4/5 opacity-75"> {switchDesc} </div>
    // </div>

    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2"> {switchHead} </h2>
        <Switch
          checked={enabled.mintOption}
          onChange={() =>
            setEnabled({
              ...enabled,
              mintOption: !enabled.mintOption,
            })
          }
          className={`${
            enabled.mintOption ? "bg-[#008080]" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled.mintOption ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />{" "}
        </Switch>
      </div>
      <div className="w-4/5 opacity-75"> {switchDesc} </div>
    </div>
  );
};

export default SwitchGroup;
