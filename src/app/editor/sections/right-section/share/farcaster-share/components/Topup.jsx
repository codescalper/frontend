import React, { useContext, useEffect } from "react";
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
import { FREE_MINTS } from "../../../../../../../data";
import { useQuery } from "@tanstack/react-query";
import { getOrCreateWallet } from "../../../../../../../services/apis/BE-apis";

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
    chainId: baseSepolia.id,
    formatUnits: "ether",
    cacheTime: 2_000,
  });

  //   console.log("feeData", feeData.formatted);

  const {
    data: walletData,
    isError: isWalletError,
    isLoading: isWalletLoading,
    error: walletError,
  } = useQuery({
    queryKey: ["getOrCreateWallet"],
    queryFn: () => getOrCreateWallet(),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnSettled: false,
    retry: false,
    retryOnMount: false,
    retryOnReconnect: false,
    retryOnSettled: false,
    staleTime: 2_000,
    cacheTime: 2_000,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      console.log("data", data);
    },
  });

//   console.log("walletData", walletData);

  //   bcoz first 50 is free so we are subtracting 50 from total mints
  const numberOfExtraMints =
    Number(farcasterStates.frameData?.allowedMints) - FREE_MINTS;

  //   console.log("numberOfExtraMints", numberOfExtraMints);

  const payForMints = (Number("0.000067513023052397") * numberOfExtraMints)
    .toFixed(18)
    .toString();

  //   console.log("payForMints", payForMints);

  const { config } = usePrepareSendTransaction({
    to: walletData?.publicAddress, // users wallet
    value: parseEther(payForMints),
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

  if (chain?.id !== baseSepolia?.id) {
    return (
      <Card>
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
      <Card>
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
      <Card>
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
    <Card>
      <List>
        <ListItem className="flex-col items-end gap-2">
          <Typography variant="h6" color="blue-gray">
            {payForMints} baseSepolia ETH
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
        </ListItem>
      </List>
    </Card>
  );
};

export default Topup;
