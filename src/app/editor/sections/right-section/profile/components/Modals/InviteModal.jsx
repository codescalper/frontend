import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { Context } from "../../../../../../../providers/context";

const InviteModal = ( ) => {
  const { openedProfilePanel, setOpenedProfilePanel } = useContext(Context);

  const handleOpen = () => {
    setOpenedProfilePanel(false);
  };


  return (
    <>
      <Dialog open={openedProfilePanel} handler={handleOpen}>
        <DialogHeader> Invite a friend </DialogHeader>
        <DialogBody>
          <div className="">
            {" "}
            Please use the code below to invite your friends
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default InviteModal;
