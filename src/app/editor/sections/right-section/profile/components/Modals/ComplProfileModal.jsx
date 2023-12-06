import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { Context } from "../../../../../../../providers/context";

const ComplProfileModal = ( ) => {
  const { openedProfilePanel, setOpenedProfilePanel } = useContext(Context);
  const [ipValue, setIpValue] = useState({
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    setIpValue({ ...ipValue, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setOpenedProfilePanel(false);
  };


  return (
    <>
      <Dialog open={openedProfilePanel} handler={handleOpen}>
        <DialogHeader> Complete your Profile </DialogHeader>
        <DialogBody>
          <div className="">
            {" "}
            Please provide Username and Email to complete your Profile
          </div>

          <div className="mt-2">
            <Input
              label="Username"
              value={ipValue.username}
              name="username"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="mt-2">
            <Input
              label="Email"
              value={ipValue.email}
              name="email"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="mt-2">
            <Button color="blue" size="sm">
              {" "}
              <div className="text-sm">Complete Profile</div>{" "}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ComplProfileModal;
