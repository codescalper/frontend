import React, { useContext, useEffect } from "react";
import { Context } from "../../../../../../../providers/context";
import {
  Card,
  List,
  ListItem,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useFeeData, useNetwork, useSwitchNetwork } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import {
  useSendTransaction,
  usePrepareSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";

const Topup = () => {
  const { farcasterStates, setFarcasterStates } = useContext(Context);
  const { chain } = useNetwork();
  const {
    data: switchData,
    isLoading: switchLoading,
    isError: switchError,
    error: switchErrorData,
    switchNetwork,
  } = useSwitchNetwork();
  const {
    data: feeData,
    isError: isFeeError,
    isLoading: isFeeLoading,
  } = useFeeData({
    chainId: base.id,
    formatUnits: "ether",
    cacheTime: 2_000,
  });

//   console.log("feeData", feeData);

  //   bcoz first 50 is free so we are subtracting 50 from total mints
  const numberOfMints = Number(farcasterStates.frameData?.allowedMints) - 50;

//   console.log("numberOfMints", numberOfMints);

  const payForMints = (Number(feeData?.formatted?.gasPrice) * numberOfMints)
    .toFixed(18)
    .toString();

//   console.log("payForMints", payForMints);



  const { config } = usePrepareSendTransaction({
    to: "0x1376c8D47585e3F0B004e5600ed2975648F71d8a", // sponsor address
    value: parseEther(payForMints),
    chainId: base.id,
  });

  const { data, isLoading, isSuccess, isError, error, sendTransaction } =
    useSendTransaction(config);

  const {
    data: txData,
    isError: isTxError,
    error: txError,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isTxSuccess) {
      setFarcasterStates({
        ...farcasterStates,
        frameData: {
          ...farcasterStates.frameData,
          isTopup: true,
        },
      });
    }
  }, [isTxSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message.split("\n")[0]);
    } else if (isTxError) {
      toast.error(txError?.message.split("\n")[0]);
    }
  }, [isError, isTxError]);

  return (
    <Card>
      <List>
        <ListItem
          className="flex-col items-end gap-2"
          onClick={() => sendTransaction?.()}
        >
          <Typography variant="h6" color="blue-gray">
            {payForMints} Base ETH
          </Typography>

          <Typography variant="h6" color="blue-gray">
            {isTxSuccess
              ? "Paid ✅"
              : isTxError || isError
              ? "Failed ❌"
              : isLoading
              ? "Conform transaction..."
              : isTxLoading
              ? "Confirming..."
              : "Pay 💵"}
          </Typography>
        </ListItem>
      </List>
    </Card>
  );
};

export default Topup;
