import React, { useContext, useState } from "react";
import Coin from "../assets/pngs/coin.png";
import { ComplProfileModal, InviteModal } from "./Modals";
import { Context } from "../../../../../../providers/context";

const TasksCard = ({ CardHead, CardSubHead, NoOfPoints, modalName }) => {

  const [openedModal, setOpenedModal] = useState("");
  const { openedProfilePanel, setOpenedProfilePanel } = useContext(Context);

  const handleOpenModal = (modalName) => {
    setOpenedModal(modalName);
    setOpenedProfilePanel(true);
  }

  return (
    <>
      <div
        onClick={() => handleOpenModal(modalName)}

        className="flex flex-col bg-[#F7F7F7] m-4 mt-2 rounded-md hover:bg-[#f3f2f2] cursor-pointer"
      >
        <div className="font-semibold text-lg p-4 pb-1 pt-4 text-[#313131]">
          {CardHead}
        </div>
        <div className="flex justify-between pb-4">
          <div className="text-base p-4 w-52">{CardSubHead}</div>

          <div className="m-2 mr-2 mt-4 p-1 bg-[#fdc14832] w-24 h-fit flex align-middle justify-around rounded-sm">
            <div className="p-1">
              {" "}
              <img className="h-6" src={Coin} alt="" />
            </div>
            <div className="text-base p-1">+{NoOfPoints}</div>
          </div>
        </div>
      </div>

      {openedModal === "profile" && <ComplProfileModal />}
      {openedModal === "invite" && <InviteModal />}
    </>
  );
};

export default TasksCard;
