import { Input } from "@material-tailwind/react";
import React from "react";

const InputBox = ({ value, onChange, placeholder, className }) => {
  return (
    <Input
      type="text"
      // className={`border px-2 py-2 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      label={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default InputBox;
