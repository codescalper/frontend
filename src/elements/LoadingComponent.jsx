import React from "react";

const LoadingComponent = ({ text }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-40">
      <div className="w-max h-max px-8 py-8 bg-white rounded-lg flex flex-col gap-5 items-center justify-center shadow-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
        <h1 className="font-bold text-2xl text-black">{text}</h1>
      </div>
    </div>
  );
};

export default LoadingComponent;
