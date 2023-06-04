import { useEffect, useState, createContext } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { App as Editor } from "./editor";

import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { authenticate, login, refreshNFT } from "./services/backendApi";
import axios from "axios";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "./services/localStorage";
import { lensChallenge } from "../lensApi";
import { Toaster, toast } from "react-hot-toast";
export const LensContext = createContext();

export default function App() {
  const [message, setMessage] = useState(
    "This message is to login you into lenspost dapp."
  );
  const [sign, setSign] = useState("");
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    data: signature,
    isError,
    isSuccess,
    error,
    signMessage,
  } = useSignMessage();
  const [profileId, setProfileId] = useState("");
  const [handle, setHandle] = useState("");
  const [token, setToken] = useState("");
  const [session, setSession] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  // remove jwt from localstorage if it is expired (24hrs)
  useEffect(() => {
    const clearLocalStorage = () => {
      const jwtExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const jwtTimestamp = getFromLocalStorage("jwt-timestamp");

      const currentTimestamp = new Date().getTime();

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        removeFromLocalStorage("jwt");
        removeFromLocalStorage("jwt-timestamp");
      }

      if (getFromLocalStorage("jwt") != undefined && isConnected) {
        // befire logout show user a message that he is going to logout because of session expiration
        disconnect();
      }
    };

    const interval = setInterval(clearLocalStorage, 60 * 60 * 1000); // Run every hour

    return () => clearInterval(interval);
  }, []);

  const genarateSignature = () => {
    if (getFromLocalStorage("jwt"))
      return setSession(getFromLocalStorage("jwt"));

    if (isConnected && !session) {
      setIsLoading(true);
      signMessage({
        message,
      });
      setText("Please sign the message to login");
    }
  };

  const userLogin = async () => {
    if (isSuccess && !session) {
      setIsLoading(true);
      setText("Logging in...");
      const res = await login(address, signature, message);

      if (res.jwt) {
        setText("");
        setIsLoading(false);
        saveToLocalStorage("jwt", res.jwt);
        saveToLocalStorage("jwt-timestamp", new Date().getTime());
        setSession(res.jwt);
      } else {
        disconnect();
        setText("");
        setIsLoading(false);
      }
    }
  };

  const updateNft = async () => {
    await refreshNFT(address);
  };

  useEffect(() => {
    if (isError) {
      disconnect();
      setIsLoading(false);
      toast.error("User rejected the signature request");
    }
  }, [isError]);

  useEffect(() => {
    if (session) {
      updateNft();
    }
  }, [address, session]);

  useEffect(() => {
    userLogin();
  }, [isSuccess]);

  useEffect(() => {
    genarateSignature();
  }, [isConnected, address]);

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
      <Editor isLoading={isLoading} text={text} />
      <Toaster />
    </LensContext.Provider>
  );
}
