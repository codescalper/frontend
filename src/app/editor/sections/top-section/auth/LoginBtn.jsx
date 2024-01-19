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
  return (
    <>

      <Typography variant="h5" color="blue-gray">
        Login with
      </Typography>

      <SolanaWallets />

      <EVMWallets />
    </>
  );
};

export default LoginBtn;
