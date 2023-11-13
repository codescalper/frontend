import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Spinner,
  Checkbox,
} from "@material-tailwind/react";
import { LOCAL_STORAGE } from "../../../../data";

const BraveShieldWarn = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(!open);

  const handleCheckbox = (e) => {
    if (e.target.checked) {
        console.log("checked");
      localStorage.setItem(LOCAL_STORAGE.braveShieldWarn, true);
    } else {
        console.log("unchecked");
      localStorage.removeItem(LOCAL_STORAGE.braveShieldWarn, false);
    }
  };

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="outline-none"
      >
        <DialogHeader className="justify-between border-b border-gray-300">
          <Typography variant="h5" color="blue-gray">
            Brave Shield Warning
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="h6" color="blue-gray">
            Keep Brave shields off for better experience.
          </Typography>
        </DialogBody>

        <DialogFooter>
          <Checkbox
            color="teal"
            className="outline-none"
            label="Don't show this again"
            onChange={handleCheckbox}
          />

          <Button
            color="teal"
            onClick={handleOpen}
            ripple="light"
            className="ml-4 outline-none"
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BraveShieldWarn;
