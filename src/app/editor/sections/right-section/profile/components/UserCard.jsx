import React from "react";
import NormieDP from "../assets/svgs/Normie/NormieDP.svg";
import NormieText from "../assets/svgs/Normie/NormieText.svg";
import NormieStar from "../assets/svgs/Normie/NormieStar.svg";
import Coin from "../assets/pngs/coin.png";
import PlebText from "../assets/svgs/Pleb/PlebText.svg";
import PlebStar from "../assets/svgs/Pleb/PlebStar.svg";
import ChadText from "../assets/svgs/Chad/ChadText.svg";
import ChadStar from "../assets/svgs/Chad/ChadStar.svg";

const UserCard = () => {
  return (
    <>
      <div className="flex justify-between m-4">
        <div className="flex flex-col justify-center align-middle">
          <img className="h-16" src={NormieDP} alt="" />
          <img className="h-6 mt-2" src={NormieText} alt="" />
          <img className="h-8 mt-2" src={NormieStar} alt="" />
        </div>

        <div className="flex flex-col justify-center align-middle">
          <div className="text-base font-medium">Points to Spend</div>

          <div className="flex align-middle justify-between bg-gray-100 rounded-full w-26 mt-2">
            <div className="m-1">
              <img className="h-6" src={Coin} alt="Coin" />
            </div>
            <div className="m-1 text-lg mr-2 ml-2">10</div>
          </div>
        </div>
      </div>

      <div className="flex ml-4">
        <div className="flex m-2 p-1 flex-col bg-blue-gray-50 w-16">
          <img className="h-4 mt-2" src={PlebText} alt="" />
          <div className="flex align-middle justify-around">
            <div className="">
              <img className="h-4 mt-2" src={PlebStar} alt="" />
              <img className="h-4 mt-2" src={PlebStar} alt="" />
            </div>
          </div>
        </div>

        <div className="flex m-2 p-1 flex-col bg-blue-gray-50 w-16">
          <img className="h-4 mt-2" src={ChadText} alt="" />
          <div className="flex align-middle justify-around">
            <div className="">
              <img className="h-4 mt-2" src={ChadStar} alt="" />
              <img className="h-4 mt-2" src={ChadStar} alt="" />
              <img className="h-4 mt-2" src={ChadStar} alt="" />
            </div>
          </div>
        </div>
      </div>
      <hr className="m-2 mt-4 "/>
    </>
  );
};

export default UserCard;
