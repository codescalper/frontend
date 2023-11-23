import { SplitsClient } from "@0xsplits/splits-sdk";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

const useSplit = () => {
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const splitsClient = new SplitsClient({
    chainId,
    walletClient,
    publicClient,
  });

  return {
    splitsClient,
  };
};

export default useSplit;
