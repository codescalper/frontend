import { useContext, useEffect, useState } from "react";
import { App as Editor } from "./editor";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { login, refreshNFT } from "./services/backendApi";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "./services/localStorage";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "./context/ContextProvider";
import { CheckInternetConnection, LoadingComponent } from "./elements";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [initialRender, setInitialRender] = useState(true);
  const { isLoading, setIsLoading, text, setText } = useContext(Context);
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
  const getUserAuthToken = getFromLocalStorage("userAuthToken");
  const getUserAddress = getFromLocalStorage("userAddress");
  const getUsertAuthTmestamp = getFromLocalStorage("usertAuthTmestamp");
  const getLensAuth = getFromLocalStorage("lensAuth");
  const getifUserEligible = getFromLocalStorage("ifUserEligible");
  const getHasUserSeenTheApp = getFromLocalStorage("hasUserSeenTheApp");
  const navigate = useNavigate();

  // remove all data from localstorage
  const clearAllLocalStorageData = () => {
    removeFromLocalStorage("userAuthToken");
    removeFromLocalStorage("usertAuthTmestamp");
    removeFromLocalStorage("userAddress");
    removeFromLocalStorage("lensAuth");
  };

  // remove jwt from localstorage if it is expired (24hrs)
  useEffect(() => {
    const clearLocalStorage = () => {
      if (getUserAuthToken === undefined) return;

      console.log("checking session");
      const jwtExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const jwtTimestamp = getFromLocalStorage("usertAuthTmestamp");

      const currentTimestamp = new Date().getTime();

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        clearAllLocalStorageData();
        setSession("");
        disconnect();
        console.log("session expired");
        toast.error("Session expired");
      }
    };

    const interval = setInterval(clearLocalStorage, 15 * 1000); // check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // generate signature
  const genarateSignature = () => {
    saveToLocalStorage("hasUserSeenTheApp", true);
    if (isDisconnected) return;

    if (
      getUserAuthToken &&
      getUserAddress &&
      getUsertAuthTmestamp &&
      address === getUserAddress
    ) {
      return setSession(getUserAuthToken);
    } else if (isConnected) {
      clearAllLocalStorageData();
      setIsLoading(true);
      signMessage({
        message,
      });
      setText("Sign the message to login");
    }
  };

  // login user
  const userLogin = async () => {
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

  const isUserEligible = () => {
    if (
      getifUserEligible &&
      getifUserEligible.address === address &&
      getifUserEligible.isUserEligible === true
    ) {
      return true;
    } else if (getHasUserSeenTheApp && getHasUserSeenTheApp === true) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    // if false redirect to ifUserEligible page
    if (!isUserEligible()) {
      navigate("/ifUserEligible");
    }
  }, []);

  useEffect(() => {
    if (isError && error?.name === "UserRejectedRequestError") {
      saveToLocalStorage("hasUserSeenTheApp", true);
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
    userLogin();
  }, [isSuccess]);

  useEffect(() => {
    // Skip the effect on the initial render
    if (initialRender) {
      setInitialRender(false);
      return;
    }

    // Run the effect when isConnected and address change
    if (isConnected && address) {
      genarateSignature();
    }
  }, [isConnected, address, initialRender]);

  // useEffect(() => {
  //   saveToLocalStorage("hasUserSeenTheApp", true);
  // }, []);

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
