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
} from "@material-tailwind/react";

const LensDispatcher = ({ title, className }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Button
        onClick={handleOpen}
        color="teal"
        className={` mx-2 outline-none ${className}`}
      >
        {title}
      </Button>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="justify-between border-b border-gray-300">
          <Typography variant="h5" color="blue-gray">
            Enable signless transactions
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
            className="outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <Typography variant="h6" color="blue-gray">
            Enable signless transactions to post on Lens without signing every
            transaction.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="teal"
            onClick={() => handleOpen(null)}
          >
            <span>Enable</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default LensDispatcher;
