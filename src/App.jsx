import { useEffect, useState, createContext } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { App as Editor } from "./editor";

import { useAccount, useSignMessage } from "wagmi";
import { authenticate, login, refreshNFT } from "./services/backendApi";
import axios from "axios";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "./services/localStorage";
import { lensChallenge } from "../lensApi";
export const LensContext = createContext();

export default function App() {
  const [message, setMessage] = useState(
    "This message is to login you into lenspost dapp."
  );
  const [sign, setSign] = useState("");
  const { address, isConnected } = useAccount();
  const {
    data: signature,
    isError,
    isLoading,
    isSuccess,
    signMessage,
  } = useSignMessage();
  const [profileId, setProfileId] = useState("");
  const [handle, setHandle] = useState("");
  const [token, setToken] = useState("");
  const [session, setSession] = useState("");

  const genarateSignature = () => {
    if (getFromLocalStorage("jwt-token") !== undefined)
      return setSession(getFromLocalStorage("jwt-token"));

    if (isConnected && !session) {
      signMessage({
        message,
      });
    }
  };

  const userLogin = async () => {
    if (isSuccess && !session) {
      const res = await login(address, signature, message);

      if (res.jwt) {
        saveToLocalStorage("jwt-token", res.jwt);
        setSession(res.jwt);

        const challegeText = await lensChallenge(address);
        signMessage({
          message: challegeText,
        });

        setSign("sign2");
      }
    }
  };

  const lensAuth = async () => {
    if (isSuccess && getFromLocalStorage("lens-auth") === undefined) {
      const lensAuth = await authenticate(address, signature);
      if (lensAuth.status === "success") {
        saveToLocalStorage("lens-auth", true);
        setSign("3");
        console.log("lensAuth", lensAuth);
      }
    }
  };

  const updateNft = async () => {
    await refreshNFT(address);
  };

  useEffect(() => {
    if (sign === "3") {
      updateNft();
    }
  }, [sign]);

  useEffect(() => {
    userLogin();

    if (sign === "sign2") {
      lensAuth();
    }
  }, [isSuccess]);

  useEffect(() => {
    genarateSignature();
  }, [isConnected]);

  return (
    <LensContext.Provider
      value={{
        session,
        setSession,
        token,
        setToken,
        handle,
        setHandle,
        profileId,
        setProfileId,
      }}
    >
      {/* {isDisconnected && <ConnectButton />}
			{isConnected && !session && (
				<div
					onClick={() => {
						connect();
						login();
					}}>
					<button>Sign in with Lens</button>
				</div>
			)}
			{isConnected && session && <Editor />} */}
      {/* <ConnectModal /> */}
      <Editor />
    </LensContext.Provider>
  );
}
