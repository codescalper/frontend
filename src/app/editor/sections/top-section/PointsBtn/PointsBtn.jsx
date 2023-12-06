import React, { useContext, useState } from "react";
import Coin from "../../right-section/profile/assets/pngs/coin.png";
import { Context } from "../../../../../providers/context";
import { Drawer } from "@blueprintjs/core";
import { ProfilePanel } from "../../right-section";

const PointsBtn = () => {
  const { menu, setMenu, isProfileOpen, setIsProfileOpen } =
    useContext(Context);

  return (
    <>
      <div
        className="flex align-middle justify-between bg-gray-100 rounded-full cursor-pointer w-16"
        onClick={() => {
          setIsProfileOpen(true);
          setMenu("profile");
        }}
      >
        <div className="m-1 cursor-pointer">
          <img className="h-6" src={Coin} alt="Coin" />
        </div>
        <div className="m-1 text-lg mr-2 ml-2">10</div>
      </div>

      <Drawer
        transitionDuration={200}
        isOpen={isProfileOpen}
        canOutsideClickClose
        size={"small"}
        onClose={() => {
          setIsProfileOpen(false);
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
