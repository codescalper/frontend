import React, { useContext, useEffect, useState } from "react";
import Coin from "../../right-section/profile/assets/pngs/coin.png";
import { Context } from "../../../../../providers/context";
import { Drawer } from "@blueprintjs/core";
import { ProfilePanel } from "../../right-section";
import { Avatar } from "@material-tailwind/react";
import { getAvatar } from "../../../../../utils";
import { useSolanaWallet } from "../../../../../hooks/solana";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { getProfileImage } from "../../../../../services";
import { useUser } from "../../../../../hooks/user";

const PointsBtn = () => {
  const { points, profileImage } = useUser();
  const { menu, setMenu, isProfileOpen, setIsProfileOpen } =
    useContext(Context);

  const { solanaAddress } = useSolanaWallet();
  const { address } = useAccount();

  return (
    <>
      <div className="flex">
        <div className="flex items-center justify-between bg-gray-100 rounded-full w-16 p-1">
          <img className="h-6" src={Coin} alt="Coin" />

          <span className="text-lg">{points}</span>
        </div>

        <div
          className="ml-4"
          onClick={() => {
            setIsProfileOpen(true);
            setMenu("profile");
          }}
        >
          <Avatar
            variant="circular"
            alt="profile picture"
            className="cursor-pointer outline outline-black"
            src={profileImage || getAvatar(address || solanaAddress)}
          />
        </div>
      </div>

      <Drawer
        transitionDuration={200}
        isOpen={isProfileOpen}
        canOutsideClickClose
        size={"small"}
        onClose={() => {
          setIsProfileOpen(!isProfileOpen);
          setMenu("share");
        }}
        className={`relative z-1000`}
      >
        <div className="fixed overflow-hidden">
          <div className="overflow-scroll">
            <div className="fixed inset-y-0 right-0 flex max-w-full top-2">
              <div className="w-screen max-w-sm mb-2">
                {menu === "profile" && <ProfilePanel />}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default PointsBtn;
