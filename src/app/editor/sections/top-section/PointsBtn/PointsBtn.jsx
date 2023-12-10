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
import { getUserProfileDetails } from "../../../../../services";

const PointsBtn = () => {
  const { menu, setMenu, isProfileOpen, setIsProfileOpen, userProfileDetails, setUserProfileDetails } =
    useContext(Context);

  const { solanaAddress } = useSolanaWallet();
  const { address } = useAccount();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getUserProfileDetails"],
    queryFn: async () => await getUserProfileDetails(),
  });

  const fnGetUserProfileDetails = async () => {
    const res = await data?.data?.message;
    console.log(res);
    setUserProfileDetails({
      email: res?.mail,
      username: res?.username,
      points: res?.points,
      lens_handle: res?.lens_handle,
    });
  }

  useEffect(() => {
    fnGetUserProfileDetails();
  }
  , [data]);

  return (
    <>
      <div
      // className="flex align-middle justify-between rounded-full cursor-pointer w-16"
      className="flex" 
      >
        {/* <div className="m-1 cursor-pointer">
          <img className="h-6" src={Coin} alt="Coin" />
        </div>
        
        <div className="m-1 text-lg mr-2 ml-2">10</div> */}
        <div className="flex align-middle justify-between bg-gray-100 rounded-full w-16 mt-2">
          <div className="m-1">
            <img className="h-6" src={Coin} alt="Coin" />
          </div>
          <div className="m-1 text-lg mr-2 ml-2">{userProfileDetails?.points}</div>
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
            src={getAvatar(address || solanaAddress)}
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
