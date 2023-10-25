import { Input } from "@material-tailwind/react";
import React from "react";

const InputBox = ({ label, value, onChange, placeholder, className, name }) => {
  return (
    <Input
      type="text"
      className={className}
      label={label}
      onChange={onChange}
      value={value}
      name={name}
      placeholder={placeholder}
    />
  );
};

export default InputBox;
