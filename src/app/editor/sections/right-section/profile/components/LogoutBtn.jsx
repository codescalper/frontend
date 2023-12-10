import React from "react";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useLogout } from "../../../../../../hooks/app";
import { Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";

const LogoutBtn = () => {
  const { logout } = useLogout();

  const fnLogout = () => {
    logout();
    toast.success("Logout successful");
  };

  return (
    <div
      onClick={fnLogout}
      className="flex justify-center cursor-pointer bg-red-50 m-4 hover:opacity-80  rounded-md"
    >
      {React.createElement(PowerIcon, {
        className: `h-4 w-4 text-red-500 mt-2.5`,
        strokeWidth: 2,
      })}
      <Typography
        as="span"
        variant="small"
        className="font-normal m-2"
        color={"red"}
      >
        Logout{" "}
      </Typography>
    </div>
  );
};

export default LogoutBtn;
