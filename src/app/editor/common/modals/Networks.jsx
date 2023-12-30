import React, { useEffect, useState } from "react";
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
import AiOutlineCloseCircle from "@meronex/icons/ai/AiOutlineCloseCircle";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { chainLogo } from "../../../../utils";

const Networks = ({ className, chains, isUnsupportedChain }) => {
  const { chain } = useNetwork();
  const { isError, error, isLoading, isSuccess, switchNetwork, variables } =
    useSwitchNetwork();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    if (isSuccess) {
      handleOpen();
    }
  }, [isSuccess]);

  return (
    <>
      <Button
        onClick={handleOpen}
        color={isUnsupportedChain ? "red" : "teal"}
        className={`${className}`}
      >
        {isUnsupportedChain ? "Unsupported Network" : chain?.name}
      </Button>

      <Dialog
        size="sm"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        handler={handleOpen}
        className="outline-none"
      >
        <DialogHeader className="gap-2 border-b flex justify-between items-center border-gray-300">
          <div className="flex items-center gap-2">
            <HiOutlineSwitchHorizontal />
            <Typography variant="h5" color="blue-gray">
              Switch Networks
            </Typography>
          </div>
          <AiOutlineCloseCircle
            onClick={handleOpen}
            className="cursor-pointer text-red-500"
          />
        </DialogHeader>
        <DialogBody>
          {chains.map((network, index) => (
            <div
              key={network?.name}
              className={`w-full rounded-lg p-2 cursor-pointer border hover:shadow-lg ${
                network?.id === chain?.id && "bg-blue-gray-50 shadow-lg"
              } hover:bg-blue-gray-50 flex justify-between items-center ${
                index != 0 && "my-2"
              }`}
              onClick={() => {
                network?.id !== chain?.id && switchNetwork(network?.id);
              }}
            >
              <div className="flex items-center">
                <img
                  src={chainLogo(network?.id)}
                  alt={network?.name}
                  className="w-8 h-8 rounded-full"
                />
                <Typography variant="h6" color="blue-gray" className="ml-2">
                  {network?.name}
                </Typography>
              </div>
              {isLoading && variables?.chainId === network?.id && (
                <Spinner color="red" />
              )}
            </div>
          ))}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default Networks;
