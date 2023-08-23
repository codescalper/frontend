import React from "react";

const InputBox = ({ value, onChange, placeholder, className }) => {
  return (
    <input
      type="text"
      className={`border px-2 py-2 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default InputBox;
