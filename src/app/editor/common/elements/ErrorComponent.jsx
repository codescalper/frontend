import React from "react";
import { fnMessage } from "../../../../utils/fnMessage";
import Lottie from "lottie-react";
import animationData from "../../../../assets/lottie/emptystates/emptyState1.json";

const ErrorComponent = ({ error }) => {
  return (
    <div className="flex justify-center items-center">
      
      <Lottie animationData={animationData}/>
      <div className="text-center">
        <p className="text-gray-500 text-sm mt-4">{fnMessage(error)}</p>
      </div>
    </div>
  );
};

export default ErrorComponent;
