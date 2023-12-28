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
import HiOutlineSwitchHorizontal from "@meronex/icons/hi/HiOutlineSwitchHorizontal";

const Networks = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="outline-none"
      >
        <DialogHeader className="gap-2 border-b border-gray-300">
          <HiOutlineSwitchHorizontal />
          <Typography variant="h5" color="blue-gray">
            Switch Networks
          </Typography>
        </DialogHeader>
        <DialogBody className="p-5">
          <img src="" alt="" />
        </DialogBody>

        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
};

export default Networks;
