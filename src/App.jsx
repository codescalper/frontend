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
import ContextProvider from "./context/ContextProvider";

export default function App() {
  const [message, setMessage] = useState(
    "This message is to login you into lenspost dapp."
  );
  const [sign, setSign] = useState("");
  const { address, isConnected, isDisconnected } = useAccount();
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
  const getUserAuthToken = getFromLocalStorage("userAuthToken");
  const getUserAddress = getFromLocalStorage("userAddress");
  const getUsertAuthTmestamp = getFromLocalStorage("usertAuthTmestamp");

  // remove jwt from localstorage if it is expired (24hrs)
  useEffect(() => {
    const clearLocalStorage = () => {
      if (getUserAuthToken === undefined) return;

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
    if (isDisconnected) return;

    if (
      getUserAuthToken &&
      getUserAddress &&
      getUsertAuthTmestamp &&
      address === getUserAddress
    ) {
      return setSession(getUserAuthToken);
    } else if (isConnected) {
      setIsLoading(true);
      signMessage({
        message,
      });
      setText("Sign the message to login");
    }
  };

  // login user
  const userLogin = async () => {
    console.log("login", isSuccess && address !== getUserAddress);
    if (isSuccess && address !== getUserAddress) {
      setIsLoading(true);
      setText("Logging in...");
      const res = await login(address, signature, message);

      if (res?.data) {
        setText("");
        setIsLoading(false);
        toast.success("Login successful");
        saveToLocalStorage("userAuthToken", res.data);
        saveToLocalStorage("usertAuthTmestamp", new Date().getTime());
        saveToLocalStorage("userAddress", address);
        setSession(res.data);
      } else if (res?.error) {
        disconnect();
        setText("");
        setIsLoading(false);
        toast.error(res);
      }
    }
  };

  const updateNft = async () => {
    const res = await refreshNFT(address);
    if (res?.data) {
      console.log(res.data);
    } else if (res?.error) {
      console.log(res.error);
    }
  };

  useEffect(() => {
    if (isError && error?.name === "UserRejectedRequestError") {
      disconnect();
      setIsLoading(false);
      toast.error("User rejected the signature request");
    }
  }, [isError]);

  useEffect(() => {
    if (session) {
      updateNft();
    }
  }, [session]);

  useEffect(() => {
    console.log({ isSuccess });
    userLogin();
  }, [isSuccess]);

  useEffect(() => {
    console.log({ address });
    genarateSignature();
  }, [isConnected, address]);

  return (
    <ContextProvider>
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
    </ContextProvider>
  );
}
