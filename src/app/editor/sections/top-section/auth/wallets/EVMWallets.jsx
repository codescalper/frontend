import { Button } from "@material-tailwind/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";

const EVMWallets = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <Button
      size="lg"
      color="black"
      className="flex items-center gap-3 outline-none"
      onClick={() => {
        openConnectModal();
        // handleOpen();
      }}
    >
      <img
        src="https://ethereum.org/static/eth-diamond-rainbow.svg"
        alt="evm"
        className="h-6 w-6"
      />
      EVM
    </Button>
  );
};

export default EVMWallets;
