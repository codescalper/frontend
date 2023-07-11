import React from "react";
import { fnMessege } from "../services/FnMessege";

const ErrorComponent = ({ error }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <p className="text-gray-500 text-sm mt-4">{fnMessege(error)}</p>
      </div>
    </div>
  );
};

export default ErrorComponent;
