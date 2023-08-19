import React from "react";
import { fnMessage } from "../../../../utils/fnMessage";


const ErrorComponent = ({ error }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <p className="text-gray-500 text-sm mt-4">{fnMessage(error)}</p>
      </div>
    </div>
  );
};

export default ErrorComponent;
