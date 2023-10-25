import { Input } from "@material-tailwind/react";
import React from "react";

const NumberInputBox = ({
  value,
  onChange,
  placeholder,
  className,
  min,
  max,
  step,
  name,
}) => {
  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      name={name}
      // className={`border px-2 py-2 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      // className={`border px-2 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      label={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default NumberInputBox;
