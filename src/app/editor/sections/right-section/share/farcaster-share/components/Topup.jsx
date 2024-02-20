import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../../../../../providers/context";
import {
  Button,
  Card,
  List,
  ListItem,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useFeeData, useNetwork, useSwitchNetwork } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import {
  useSendTransaction,
  usePrepareSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";

const Topup = ({ topUpAccount, balance, refetch, sponsored }) => {
  const { farcasterStates, setFarcasterStates } = useContext(Context);
  const [extraPayForMints, setExtraPayForMints] = useState(null);
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
    chainId: baseSepolia.id,
    formatUnits: "ether",
    cacheTime: 2_000,
  });

  const isSufficientBalance = farcasterStates.frameData?.isSufficientBalance;

  //   bcoz first 50 is free so we are subtracting 50 from total mints
  const numberOfExtraMints =
    Number(farcasterStates.frameData?.allowedMints) - sponsored;

  const payForMints = (Number("0.000067513023052397") * numberOfExtraMints)
    .toFixed(18)
    .toString();

  const { config } = usePrepareSendTransaction({
    to: topUpAccount, // users wallet
    value: extraPayForMints
      ? parseEther(extraPayForMints)
      : parseEther(payForMints),
    chainId: baseSepolia.id,
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

  // change the frameData isTopup to true if transaction is success
  useEffect(() => {
    if (isTxSuccess) {
      setFarcasterStates({
        ...farcasterStates,
        frameData: {
          ...farcasterStates.frameData,
          isTopup: true,
        },
      });
      refetch();
    }
  }, [isTxSuccess]);

  // check if the user has enough balance to pay for mints
  useEffect(() => {
    if (balance >= payForMints) {
      // balance is sufficient
      setFarcasterStates({
        ...farcasterStates,
        frameData: {
          ...farcasterStates.frameData,
          isSufficientBalance: true,
        },
      });
    } else {
      // balance is not sufficient
      setFarcasterStates({
        ...farcasterStates,
        frameData: {
          ...farcasterStates.frameData,
          isSufficientBalance: false,
        },
      });

      // if the user has insufficient balance then we need to topup
      setExtraPayForMints((payForMints - balance).toFixed(18).toString());
    }
  }, [farcasterStates.frameData.allowedMints, balance]);

  // get the error message
  useEffect(() => {
    if (isError) {
      toast.error(error?.message.split("\n")[0]);
    } else if (isTxError) {
      toast.error(txError?.message.split("\n")[0]);
    }
  }, [isError, isTxError]);

  if (chain?.id !== baseSepolia?.id) {
    return (
      <Card className="my-2">
        <List>
          <ListItem
            className="flex justify-between items-center gap-2"
            onClick={() => switchNetwork(baseSepolia?.id)}
          >
            <Typography variant="h6" color="blue-gray">
              Please switch to {baseSepolia?.name} network
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  if (isFeeLoading) {
    return (
      <Card className="my-2">
        <List>
          <ListItem className="flex justify-between items-center gap-2">
            <Spinner color="green" />
          </ListItem>
        </List>
      </Card>
    );
  }

  if (isFeeError) {
    return (
      <Card className="my-2">
        <List>
          <ListItem className="flex justify-between items-center gap-2">
            <Typography variant="h6" color="blue-gray">
              Error fetching gas price
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  return (
    <Card className="my-2">
      <List>
        <ListItem className="flex-col items-end gap-2">
          {isSufficientBalance ? (
            <Typography variant="h6" color="green">
              Sufficient balance to pay for mints
            </Typography>
          ) : (
            <>
              <Typography variant="h6" color="red">
                Insufficient balance please topup
              </Typography>
              <Typography variant="h6" color="blue-gray">
                {extraPayForMints ? extraPayForMints : payForMints} {baseSepolia?.name}{" "}
                {baseSepolia?.nativeCurrency?.symbol}
              </Typography>

              <div className="w-full flex justify-between items-center">
                {isTxLoading || isLoading ? (
                  <div className="flex justify-start gap-2">
                    <Typography variant="h6" color="blue-gray">
                      {isLoading
                        ? "Confirm transaction"
                        : isTxLoading
                        ? "Confirming"
                        : ""}
                    </Typography>
                    <Spinner color="green" />
                  </div>
                ) : (
                  <div></div>
                )}

                {isTxSuccess ? (
                  <Button color="green" size="sm" className="flex justify-end">
                    Paid
                  </Button>
                ) : (
                  <Button
                    onClick={() => sendTransaction?.()}
                    color="green"
                    size="sm"
                    className="flex justify-end"
                  >
                    Pay
                  </Button>
                )}
              </div>
            </>
          )}
        </ListItem>
      </List>
    </Card>
  );
};

export default Topup;
