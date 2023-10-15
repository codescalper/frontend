import React, { useContext, useState } from "react";
import {
  addressCrop,
  clearAllLocalStorageData,
  getAvatar,
  getFromLocalStorage,
} from "../../../../../utils";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "react-toastify";
import { Context } from "../../../../../context/ContextProvider";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";

import { ClipboardIcon, PowerIcon } from "@heroicons/react/24/outline";

const ProfileMenu = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const getLensAuth = getFromLocalStorage("lensAuth");
  const { posthog } = useContext(Context);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success("address copied");
  };

  const logout = () => {
    posthog.reset();
    clearAllLocalStorageData();
    disconnect();
    toast.success("Logout successful");
  };

  // profile menu component
  const profileMenuItems = [
    {
      label: addressCrop(address),
      icon: ClipboardIcon,
      onClick: handleCopy,
    },
    {
      label: "Logout",
      icon: PowerIcon,
      onClick: logout,
    },
  ];

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <Avatar
          variant="circular"
          alt="profile picture"
          className="cursor-pointer outline outline-black"
          src={getAvatar(address)}
        />
      </MenuHandler>
      <MenuList className="p-1 mt-2">
        {profileMenuItems.map(({ label, icon, onClick }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <div className="outline-none">
              {isLastItem && <hr className="my-2 border-blue-gray-50" />}
              <MenuItem
                key={label}
                onClick={onClick}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}

                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            </div>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
