import React, { useContext } from "react";
import { Button, Position, Menu } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import {
  addressCrop,
  clearAllLocalStorageData,
  getAvatar,
  getFromLocalStorage,
} from "../../../../../utils";
import { useAccount, useDisconnect } from "wagmi";
import BiCopy from "@meronex/icons/bi/BiCopy";
import FiLogOut from "@meronex/icons/fi/FiLogOut";
import AiOutlineUser from "@meronex/icons/ai/AiOutlineUser";
import { toast } from "react-toastify";
import { Context } from "../../../../../context/ContextProvider";

const UserSetting = () => {
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
    toast.success("Logout successfully");
  };

  const Elements = ({ text, onClickFuntion, Icon }) => {
    return (
      <div
        className="h-10 cursor-pointer px-2 flex gap-2 items-center hover:bg-blue-gray-50 rounded-md"
        onClick={onClickFuntion}
      >
        <Icon className="h-5 w-5" />
        <p>{text}</p>
      </div>
    );
  };

  return (
    <Popover2
      content={
        <Menu>
          {getLensAuth && (
            <>
              <Elements text={getLensAuth} Icon={AiOutlineUser} />
              <hr />
            </>
          )}
          <Elements
            text={addressCrop(address)}
            onClickFuntion={handleCopy}
            Icon={BiCopy}
          />

          <hr />
          <Elements text="Logout" onClickFuntion={logout} Icon={FiLogOut} />
        </Menu>
      }
      position={Position.BOTTOM_RIGHT}
    >
      <div className="h-10 w-10 rounded-full cursor-pointer overflow-hidden border border-black">
        <img src={getAvatar(address)} alt="" />
      </div>
    </Popover2>
  );
};

export default UserSetting;
