import { useEffect, useState } from "react";
import { App as Editor } from "./editor";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { login, refreshNFT } from "./services/backendApi";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "./services/localStorage";
import CheckInternetConnection from "./elements/CheckInternetConnection";
import LoadingComponent from "./elements/LoadingComponent";
import { ToastContainer, toast } from "react-toastify";

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
  const [session, setSession] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  // remove jwt from localstorage if it is expired (24hrs)
  useEffect(() => {
    const clearLocalStorage = () => {
      if (getFromLocalStorage("userAuthToken") === undefined) return;

      console.log("checking session");
      const jwtExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const jwtTimestamp = getFromLocalStorage("usertAuthTmestamp");

      const currentTimestamp = new Date().getTime();

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        removeFromLocalStorage("userAuthToken");
        removeFromLocalStorage("usertAuthTmestamp");
        removeFromLocalStorage("userAddress");
        setSession("");
        disconnect();
        console.log("session expired");
        toast.error("Session expired");
      }
    };

    const interval = setInterval(clearLocalStorage, 1 * 60 * 1000); // Run every minutes

    return () => clearInterval(interval);
  }, []);

  // generate signature
  const genarateSignature = async () => {
    if (getFromLocalStorage("userAuthToken"))
      return setSession(getFromLocalStorage("userAuthToken"));

    if (isConnected && !session) {
      setIsLoading(true);
      signMessage({
        message,
      });
      setText("Please sign the message to login");
    }
  };

  // login user
  const userLogin = async () => {
    if (isSuccess && !session) {
      setIsLoading(true);
      setText("Logging in...");
      const res = await login(address, signature, message);

      if (res?.jwt) {
        setText("");
        setIsLoading(false);
        toast.success("Login successful");
        saveToLocalStorage("userAuthToken", res.jwt);
        saveToLocalStorage("usertAuthTmestamp", new Date().getTime());
        saveToLocalStorage("userAddress", address);
        setSession(res.jwt);
      } else {
        disconnect();
        setText("");
        setIsLoading(false);
        toast.error(res);
      }
    }
  };

  // const updateNft = async () => {
  //   await refreshNFT(address);
  // };

  useEffect(() => {
    if (isError && error?.name === "UserRejectedRequestError") {
      disconnect();
      setIsLoading(false);
      toast.error("User rejected the signature request");
    }
  }, [isError]);

  // useEffect(() => {
  //   if (session) {
  //     updateNft();
  //   }
  // }, [address, session]);

  useEffect(() => {
    userLogin();
  }, [isSuccess]);

  useEffect(() => {
    genarateSignature();
  }, [isConnected]);

  return (
    <>
      <Editor />
      <CheckInternetConnection />
      {isLoading && <LoadingComponent text={text} />}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
