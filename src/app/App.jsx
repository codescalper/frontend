import { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import {
  login,
  refreshNFT,
  solanaAuth,
} from "../services/apis/BE-apis/backendApi";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorage";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../providers/context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { useTour } from "@reactour/tour";

import Editor from "./editor/Editor";
import {
  CheckInternetConnection,
  LoadingComponent,
  OnboardingSteps,
  OnboardingStepsWithShare,
} from "./editor/common";
import { clearAllLocalStorageData } from "../utils";
import { useSolanaWallet, useSolanaWalletError } from "../hooks/solana";
import { useMutation } from "@tanstack/react-query";
import { EVM_MESSAGE, SOLANA_MESSAGE } from "../data";

const App = () => {
  const {solanaWalletError} = useSolanaWalletError();
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const [initialRender, setInitialRender] = useState(true);
  const { isLoading, setIsLoading, text, setText, posthog } =
    useContext(Context);
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
  const getifUserEligible = getFromLocalStorage("ifUserEligible");
  const getHasUserSeenTheApp = getFromLocalStorage("hasUserSeenTheApp");
  const navigate = useNavigate();
  const { solanaConnected, solanaSignMessage, solanaAddress } =
    useSolanaWallet();
  const [solanaSignature, setSolanaSignature] = useState("");

  console.log("solanaWalletError", solanaWalletError);

  // remove jwt from localstorage if it is expired (24hrs)
  useEffect(() => {
    const clearLocalStorage = () => {
      if (getUserAuthToken === undefined) return;

      console.log("checking session");
      const jwtExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const jwtTimestamp = getFromLocalStorage("usertAuthTmestamp");

      const currentTimestamp = new Date().getTime();

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        posthog.reset();
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

  // generate signature for EVM
  const generateSignature = () => {
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
        message: EVM_MESSAGE,
      });
      setText("Sign the message to login");
    }
  };

  // generate signature for solana
  const generateSignatureSolana = async () => {
    setIsLoading(true);
    setText("Sign the message to login");

    // pass the message as Uint8Array
    const message = new Uint8Array(Buffer.from(SOLANA_MESSAGE));
    const signature = await solanaSignMessage(message);

    // convert the signature to base64
    const signatureBase64 = Buffer.from(signature).toString("base64");
    console.log(signatureBase64);
    setSolanaSignature(signatureBase64);
  };

  // solana login
  const { mutateAsync: solanaLogin } = useMutation({
    mutationKey: "solanaLogin",
    mutationFn: solanaAuth,
  });

  // login user
  const userLogin = async () => {
    if (isSuccess && address !== getUserAddress) {
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
        saveToLocalStorage("lensAuth", res?.lensHandle);
        setSession(res.jwt);
        posthog.identify(address);
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
    if (solanaSignature) {
      solanaLogin({
        address: solanaAddress,
        signature: solanaSignature,
        message: SOLANA_MESSAGE,
      })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  }, [solanaSignature]);

  useEffect(() => {
    // Run the effect when isConnected and address change
    if (isConnected && address) {
      generateSignature();
    }
  }, [isConnected, address, initialRender]);

  useEffect(() => {
    // Run the effect when isConnected and address change
    if (solanaConnected && solanaAddress) {
      generateSignatureSolana();
    }
  }, [solanaConnected]);

  useEffect(() => {
    // check if browser is Brave
    if (window.navigator?.brave) {
      toast.warning("Keep Brave shields off for better experience");
    }
  }, []);

  useEffect(() => {
    if (isUserEligible) {
      if (!getFromLocalStorage("hasTakenTour")) {
        if (isConnected) {
          setIsOpen(true);
          setSteps(OnboardingStepsWithShare);
        } else {
          setIsOpen(true);
          setSteps(OnboardingSteps);
        }
        setTimeout(() => saveToLocalStorage("hasTakenTour", true), 20000);
      }
    }
  }, []);

  return (
    <>
      <Editor />
      <CheckInternetConnection />
      {isLoading && <LoadingComponent text={text} />}
      <ToastContainer
        position="top-center"
        autoClose={3000}
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
};

export default App;
