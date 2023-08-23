import React from "react";

const NumberInputBox = ({
  value,
  onChange,
  placeholder,
  className,
  min,
  max,
  step,
}) => {
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      className={`border px-2 py-2 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default NumberInputBox;
