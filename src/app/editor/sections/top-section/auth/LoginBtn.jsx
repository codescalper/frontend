import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { EVMWallets, SolanaWallets } from "./wallets";

const LoginBtn = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="gradient"
        color="blue"
        className="outline-none"
        size="md"
      >
        Login
      </Button>
      <Dialog
        className="outline-none"
        size="sm"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Login with
          </Typography>
          <IconButton
            className="outline-none focus:outline-none"
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
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
        <DialogBody className="flex justify-center gap-5 mb-8">
          <SolanaWallets />

          <EVMWallets />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default LoginBtn;
