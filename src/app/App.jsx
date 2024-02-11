import { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import {
  refreshNFT,
  solanaAuth,
  evmAuth,
  getJSONDataForSlug,
} from "../services/apis/BE-apis/backendApi";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorage";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../providers/context/ContextProvider";
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTour } from "@reactour/tour";

import Editor from "./editor/Editor";
import {
  BraveShieldWarn,
  CheckInternetConnection,
  LoadingComponent,
  OnboardingSteps,
  OnboardingStepsWithShare,
} from "./editor/common";
import { clearAllLocalStorageData, errorMessage } from "../utils";
import { useSolanaWallet } from "../hooks/solana";
import { useMutation } from "@tanstack/react-query";
import { ERROR, EVM_MESSAGE, LOCAL_STORAGE, SOLANA_MESSAGE } from "../data";
import bs58 from "bs58";
import { ExplorerDialog } from "./editor/sections/right-section/share/components";
import { ENVIRONMENT } from "../services";
import { SolanaWalletErrorContext } from "../providers/solana/SolanaWalletProvider";
import { useLogout } from "../hooks/app";
import { useStore } from "../hooks/polotno";

const App = () => {
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const [initialRender, setInitialRender] = useState(true);
  const {
    isLoading,
    setIsLoading,
    text,
    setText,
    posthog,
    dialogOpen,
    explorerLink,
    handleOpen,
    contextCanvasIdRef,
  } = useContext(Context);
  const [sign, setSign] = useState("");
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    data: evmSignature,
    isError,
    isSuccess,
    error,
    signMessage,
  } = useSignMessage();
  const [session, setSession] = useState("");
  const getEvmAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const getUserAuthToken = getFromLocalStorage(LOCAL_STORAGE.userAuthToken);
  const getUserAddress = getFromLocalStorage(LOCAL_STORAGE.userAddress);
  const getUsertAuthTmestamp = getFromLocalStorage(LOCAL_STORAGE.userAuthTime);
  const getifUserEligible = getFromLocalStorage(LOCAL_STORAGE.ifUserEligible);
  const isBraveShieldWarn = getFromLocalStorage(LOCAL_STORAGE.braveShieldWarn);
  const getHasUserSeenTheApp = getFromLocalStorage(
    LOCAL_STORAGE.hasUserSeenTheApp
  );
  const navigate = useNavigate();
  const {
    solanaConnected,
    solanaSignMessage,
    solanaAddress,
    solanaDisconnect,
  } = useSolanaWallet();
  const [solanaSignature, setSolanaSignature] = useState("");
  const { solanaWalletError, setSolanaWalletError } = useContext(
    SolanaWalletErrorContext
  );
  const { logout } = useLogout();

  // clear the session if it is expired (24hrs)
  useEffect(() => {
    const clearLocalStorage = () => {
      if (getUserAuthToken === undefined) return;

      console.log("checking session");
      const jwtExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const jwtTimestamp = getFromLocalStorage(LOCAL_STORAGE.userAuthTime);

      const currentTimestamp = new Date().getTime();

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        logout();
        setSession("");
        console.log("session expired");
        toast.error("Session expired");

        // TODO: clear all local storage data + states
      }
    };

    const interval = setInterval(clearLocalStorage, 15 * 1000); // check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // generate signature for EVM
  const generateSignature = () => {
    saveToLocalStorage(LOCAL_STORAGE.hasUserSeenTheApp, true);
    if (isDisconnected) return;

    if (getEvmAuth) {
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
    saveToLocalStorage(LOCAL_STORAGE.hasUserSeenTheApp, true);

    if (getSolanaAuth) {
      return setSession(getUserAuthToken);
    } else if (solanaConnected) {
      setIsLoading(true);
      setText("Sign the message to login");

      // pass the message as Uint8Array
      const message = new TextEncoder().encode(SOLANA_MESSAGE);
      const signature = await solanaSignMessage(message);

      // convert the signature to base58
      const signatureBase58 = bs58.encode(signature);
      setSolanaSignature(signatureBase58);
    }
  };

  // EVM login
  const { mutateAsync: evmAuthAsync } = useMutation({
    mutationKey: "evmAuth",
    mutationFn: evmAuth,
  });

  // Solana login
  const { mutateAsync: solanaAuthAsync } = useMutation({
    mutationKey: "solanaAuth",
    mutationFn: solanaAuth,
  });

  // EVM auth handler
  const evmAuthHandler = async () => {
    setIsLoading(true);
    setText("Logging in...");
    await evmAuthAsync({
      walletAddress: address,
      signature: evmSignature,
      message: EVM_MESSAGE,
    })
      .then((res) => {
        if (res?.status === "success") {
          setText("");
          setIsLoading(false);
          toast.success("Login successful");
          saveToLocalStorage(LOCAL_STORAGE.evmAuth, true);
          saveToLocalStorage(LOCAL_STORAGE.userAuthToken, res.jwt);
          saveToLocalStorage(LOCAL_STORAGE.userAuthTime, new Date().getTime());
          saveToLocalStorage(LOCAL_STORAGE.userAddress, address);
          saveToLocalStorage(LOCAL_STORAGE.lensAuth, {
            profileId: res?.profileId,
            profileHandle: res?.profileHandle,
          });
          saveToLocalStorage(LOCAL_STORAGE.userId, res?.userId);
          setSession(res.jwt);
          posthog.identify(res?.userId, {
            evm_address: address,
          });
        } else {
          toast.error(ERROR.SOMETHING_WENT_WRONG);
          disconnect();
          setText("");
          setIsLoading(false);
          toast.error(res);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(errorMessage(err));
        disconnect();
        setText("");
        setIsLoading(false);
      });
  };

  // Solana auth handler
  const solanaAuthHandler = async () => {
    setIsLoading(true);
    setText("Logging in...");
    await solanaAuthAsync({
      walletAddress: solanaAddress,
      signature: solanaSignature,
      message: SOLANA_MESSAGE,
    })
      .then((res) => {
        if (res?.status === "success") {
          setText("");
          setIsLoading(false);
          toast.success("Login successful");
          saveToLocalStorage(LOCAL_STORAGE.solanaAuth, true);
          saveToLocalStorage(LOCAL_STORAGE.userAuthToken, res.jwt);
          saveToLocalStorage(LOCAL_STORAGE.userAuthTime, new Date().getTime());
          saveToLocalStorage(LOCAL_STORAGE.userAddress, solanaAddress);
          saveToLocalStorage(LOCAL_STORAGE.lensAuth, {
            profileId: res?.profileId,
            profileHandle: res?.profileHandle,
          });
          saveToLocalStorage(LOCAL_STORAGE.userId, res?.userId);
          setSession(res.jwt);
          posthog.identify(res?.userId, {
            solana_address: solanaAddress,
          });
        } else {
          toast.error(ERROR.SOMETHING_WENT_WRONG);
          disconnect();
          setText("");
          setIsLoading(false);
          toast.error(res);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(errorMessage(err));
        disconnect();
        setText("");
        setIsLoading(false);
      });
  };

  // update nfts for EVM + Solana
  const { mutate: updateNft } = useMutation({
    mutationKey: "refreshNFT",
    mutationFn: refreshNFT,
    onSuccess: (res) => {
      console.log(res?.message);
    },
    onError: (err) => {
      console.log(err);
    },
  });

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
    // if false redirect to ifUserEligible page but only in production
    if (ENVIRONMENT === "production") {
      if (!isUserEligible()) {
        navigate("/ifUserEligible");
      }
    }
  }, []);

  // -- Testing Share Canvas Start --

  // useEffect(() => {
  //   const slugId = 20174;
  //   if (isUserEligible()) {
  //     navigate(`/design/${slugId}?share=true`);
  //     // navigate(`/`);
  //     contextCanvasIdRef.current = slugId;
  //     redirect(`/design/${slugId}`);
  //   }
  // }, []);

  const { slugId } = useParams();
  const location = useLocation();
  // const { store } = useStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const share = queryParams.get("share");

    if (isUserEligible()) {
      if (share === "true" && slugId) {
        // Redirect to '/design/:slugId' without the 'share' query parameter
        navigate(`/design/${slugId}`, { replace: true });
      }
    }

    if (slugId) {
      // contextCanvasIdRef.current = slugId;
      fnLoadDataOnCanvas();
    }
  }, [location, navigate, slugId]);

  const fnLoadDataOnCanvas = async () => {
    const store = useStore();
    const dataForSlug = await getJSONDataForSlug(slugId);
    console.log("dataForSlug", dataForSlug?.data);

    const ogImageLink = dataForSlug?.data?.image;
    store.loadJSON(dataForSlug?.data?.data);

    let metaTag = document.querySelector('meta[property="og:image"]');
    if (!metaTag) {
      // If the meta tag doesn't exist, create it
      metaTag = document.createElement("meta");
      metaTag.setAttribute("property", "og:image");
      document.getElementsByTagName("head")[0].appendChild(metaTag);
    }
    // Set or update the content of the meta tag
    metaTag.setAttribute("content", ogImageLink);
  };
  // -- Testing Share Canvas End --

  useEffect(() => {
    if (isError && error?.name === "UserRejectedRequestError") {
      saveToLocalStorage(LOCAL_STORAGE.hasUserSeenTheApp, true);
      disconnect();
      setIsLoading(false);
      toast.error("User rejected the signature request");
    }
  }, [isError]);

  useEffect(() => {
    if (solanaWalletError.isError) {
      saveToLocalStorage(LOCAL_STORAGE.hasUserSeenTheApp, true);
      solanaDisconnect();
      setIsLoading(false);
      toast.error(solanaWalletError.message);

      setTimeout(() => {
        setSolanaWalletError({
          isError: false,
          name: "",
          message: "",
        });
      }, 2000);
    }
  }, [solanaWalletError.isError]);

  useEffect(() => {
    if (session) {
      updateNft();
    }
  }, [session]);

  useEffect(() => {
    if (isSuccess) {
      evmAuthHandler();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (solanaSignature) {
      solanaAuthHandler();
    }
  }, [solanaSignature]);

  useEffect(() => {
    // Run the effect when isConnected and address change
    if (isConnected && address) {
      generateSignature();
    }
  }, [isConnected, address, initialRender]);

  useEffect(() => {
    // Run the effect when solanaConnected and solanaAddress change
    if (solanaConnected && solanaAddress) {
      generateSignatureSolana();
    }
  }, [solanaConnected, solanaAddress]);

  return (
    <>
      <Editor />
      {window.navigator?.brave && !isBraveShieldWarn && <BraveShieldWarn />}
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
