import { useDisconnect } from "wagmi";
import { useSolanaWallet } from "../solana";
import { useContext } from "react";
import { Context } from "../../providers/context";
import { clearAllLocalStorageData } from "../../utils";

const useLogout = () => {
  const { solanaDisconnect } = useSolanaWallet();
  const { disconnect } = useDisconnect();
  const { posthog } = useContext(Context);

  const logout = () => {
    disconnect();
    solanaDisconnect();
    posthog.reset();
    clearAllLocalStorageData();
  };

  return {
    logout,
  };
};

export default useLogout;
