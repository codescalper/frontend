import { useContext, useState, useEffect } from "react";
import {
  useAccount,
  useChainId,
  useNetwork,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import {
  checkDispatcher,
  lensAuthenticate,
  getBroadcastData,
  shareOnSocials,
  lensChallenge,
  signSetDispatcherTypedData,
  ENVIRONMENT,
  setBroadcastOnChainTx,
  getSocialDetails,
  getTop5SocialDetails,
  NEYNAR_CLIENT_ID,
} from "../../../../../../../services";
import { toast } from "react-toastify";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import BsLink45Deg from "@meronex/icons/bs/BsLink45Deg";
import AiOutlinePlus from "@meronex/icons/ai/AiOutlinePlus";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  errorMessage,
  isEthAddress,
  isLensHandle,
  jsConfettiFn,
} from "../../../../../../../utils";
import testnetTokenAddress from "../../../../../../../data/json/testnet-token-list.json";
import mainnetTokenAddress from "../../../../../../../data/json/mainnet-token-list.json";
import {
  CustomPopover,
  InputBox,
  InputErrorMsg,
  NumberInputBox,
} from "../../../../../common";
import { useStore } from "../../../../../../../hooks/polotno";
// import SplitPolicyCard from "../../../../../../data/constant/SplitPolicyCard";
import BsX from "@meronex/icons/bs/BsX";
import {
  LensAuth,
  LensDispatcher,
  SplitPolicyCard,
} from "../../lens-share/components";
import {
  useAppAuth,
  useDynamicScript,
  useLocalStorage,
  useReset,
} from "../../../../../../../hooks/app";
import {
  APP_ETH_ADDRESS,
  APP_LENS_HANDLE,
  ERROR,
  LOCAL_STORAGE,
} from "../../../../../../../data";
import {
  Button,
  Select,
  Option,
  Tabs,
  Tab,
  TabsHeader,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import { SharePanelHeaders } from "../../components";
import FarcasterAuth from "./FarcasterAuth";
import { getFarUserDetails } from "../../../../../../../services/apis/BE-apis";
import FarcasterChannel from "./FarcasterChannel";

const FarcasterNormalPost = () => {
  const { resetState } = useReset();
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);

  const {
    postDescription,
    contextCanvasIdRef,

    farcasterStates, // don't remove this
    lensAuthState, // don't remove this
  } = useContext(Context);

  const [sharing, setSharing] = useState(false);
  const { isFarcasterAuth } = useLocalStorage();

  const { mutateAsync: shareOnLens } = useMutation({
    mutationKey: "shareOnFarcaster",
    mutationFn: shareOnSocials,
  });

  // share post on lens
  const sharePost = async (platform) => {
    // check if canvasId is provided
    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }
    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    setSharing(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "Farvaster post",
      content: postDescription,
    };

    const id = toast.loading(`Sharing on ${platform}...`);
    shareOnLens({
      canvasData: canvasData,
      canvasParams: {
        zoraMintLink: "",
      },
      platform: platform,
    })
      .then((res) => {
        if (res?.txHash) {
          jsConfettiFn();

          toast.update(id, {
            render: `Successfully shared on ${platform}`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          });

          // clear all the variables
          resetState();
        } else if (res?.error || res?.reason === "REJECTED") {
          toast.update(id, {
            render: res?.error || ERROR.SOMETHING_WENT_WRONG,
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          });
          setSharing(false);
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: errorMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        setSharing(false);
      });
  };

  return (
    <>
      <div className="mb-4 m-4">
        <FarcasterChannel/>
      </div>

      {/* <div className="flex flex-col bg-white shadow-2xl rounded-lg rounded-r-none">
        {!getEVMAuth ? (
          <EVMWallets title="Login with EVM" className="mx-2" />
        ) : !isFarcasterAuth ? (
          <FarcasterAuth />
        ) : (
          <div className="mx-2 my-2 outline-none">
            <Button
              className="w-full outline-none"
              disabled={sharing}
              onClick={() => sharePost("farcaster")}
              color="teal"
            >
              Share
            </Button>
          </div>
        )}
      </div> */}
    </>
  );
};

export default FarcasterNormalPost;
