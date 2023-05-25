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

  // remove jwt/lens-auth from localstorage
  useEffect(() => {
    const clearLocalStorage = () => {
      const jwtExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const jwtTimestamp = localStorage.getItem("jwt-timestamp");
      const lensAuthTimestamp = localStorage.getItem("lens-auth-timestamp");

      const currentTimestamp = new Date().getTime();

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("jwt-timestamp");
      }

      if (
        lensAuthTimestamp &&
        currentTimestamp - lensAuthTimestamp > jwtExpiration
      ) {
        localStorage.removeItem("lensAuth");
        localStorage.removeItem("lens-auth-timestamp");
      }
    };

    const interval = setInterval(clearLocalStorage, 60 * 60 * 1000); // Run every hour

    return () => clearInterval(interval);
  }, []);

  const genarateSignature = () => {
    if (getFromLocalStorage("jwt") != undefined)
      return setSession(getFromLocalStorage("jwt"));

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
        saveToLocalStorage("jwt", res.jwt);
        saveToLocalStorage("jwt-timestamp", new Date().getTime());
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
    if (isSuccess) {
      const lensAuth = await authenticate(address, signature);
      if (lensAuth.status === "success") {
        saveToLocalStorage("lens-auth", true);
        saveToLocalStorage("lens-auth-timestamp", new Date().getTime());
        setSign("3");
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
      <Editor />
    </LensContext.Provider>
  );
}
