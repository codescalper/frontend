import { Input } from "@material-tailwind/react";
import React from "react";

const NumberInputBox = ({
  label,
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
      className={className}
      label={label}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default NumberInputBox;
