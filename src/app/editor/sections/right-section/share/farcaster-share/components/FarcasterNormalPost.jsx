import { useContext, useEffect, useState } from "react";
import { shareOnSocials } from "../../../../../../../services";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import {
  getFromLocalStorage,
  errorMessage,
  jsConfettiFn,
} from "../../../../../../../utils";
import { useLocalStorage, useReset } from "../../../../../../../hooks/app";
import { ERROR, LOCAL_STORAGE } from "../../../../../../../data";
import { Button } from "@material-tailwind/react";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import FarcasterAuth from "./FarcasterAuth";
import FarcasterChannel from "./FarcasterChannel";
import { Switch } from "@headlessui/react";
import { ZoraDialog } from "../../zora-mint/components";
import logoFarcaster from "../../../../../../../assets/logos/logoFarcaster.jpg";

const FarcasterNormalPost = () => {
  const { resetState } = useReset();
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isShareSuccess, setIsShareSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [farTxHash, setFarTxHash] = useState("");

  const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);
  const [isSuccessIpfs, setIsSuccessIpfs] = useState(false);

  const {
    postDescription,
    contextCanvasIdRef,
    setFarcasterStates,
    farcasterStates, // don't remove this
    lensAuthState, // don't remove this
  } = useContext(Context);

  const { isFarcasterAuth } = useLocalStorage();

  const { mutateAsync: shareOnFarcaster } = useMutation({
    mutationKey: "shareOnFarcaster",
    mutationFn: shareOnSocials,
  });

  const monetizationSettings = () => {
    let canvasParams = {};

    if (farcasterStates.isChannel) {
      canvasParams = {
        ...canvasParams,
        zoraMintLink: "",
        channelId: farcasterStates.channel?.id,
      };
    }

    if (farcasterStates.isFrame) {
      canvasParams = {
        ...canvasParams,
        frameLink: `https://frames.lenspost.xyz/frame/${contextCanvasIdRef.current}`,
      };
    }

    return canvasParams;
  };

  // fake api call
  const UploadTpIPFS = async () => {
    setIsUploadingToIPFS(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsUploadingToIPFS(false);
        setIsSuccessIpfs(true);
        resolve(true);
      }, 3000);
    });
  };

  // share post on lens
  const sharePost = async (platform) => {
    setIsShareLoading(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "Farcaster post",
      content: postDescription,
    };

    shareOnFarcaster({
      canvasData: canvasData,
      canvasParams: monetizationSettings(),
      platform: platform,
    })
      .then((res) => {
        if (res?.txHash) {
          setIsShareLoading(false);
          setFarTxHash(res?.txHash);
          setIsShareSuccess(true);

          // open the dialog
        } else if (res?.error || res?.reason === "REJECTED") {
          setIsError(true);
          setIsShareLoading(false);
          toast.error(res?.error);
        }
      })
      .catch((err) => {
        setIsError(true);
        setIsShareLoading(false);
        toast.error(errorMessage(err));
      });
  };

  const handleSubmit = () => {
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

    // upload to IPFS
    UploadTpIPFS();
  };

  useEffect(() => {
    if (isSuccessIpfs) {
      sharePost("farcaster");
    }
  }, [isSuccessIpfs]);

  return (
    <>
      <ZoraDialog
        title="Share on Farcaster"
        icon={logoFarcaster}
        isError={isError}
        isLoading={false}
        isCreatingSplit={null}
        isUploadingToIPFS={isUploadingToIPFS}
        isPending={null}
        isShareLoading={isShareLoading}
        isShareSuccess={isShareSuccess}
        isOpenAction={false}
        isFarcaster={true}
        data={null}
        farTxHash={farTxHash}
        isSuccess={false}
      />
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Channel </h2>
          <Switch
            checked={farcasterStates.isChannel}
            onChange={() =>
              setFarcasterStates({
                ...farcasterStates,
                isChannel: !farcasterStates.isChannel,
              })
            }
            className={`${
              farcasterStates.isChannel ? "bg-[#e1f16b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
          >
            <span
              className={`${
                farcasterStates.isChannel ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Share your post in the Farcaster channel.{" "}
        </div>
      </div>
      <div className={`m-4 ${!farcasterStates.isChannel && "hidden"}`}>
        <FarcasterChannel />
      </div>

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Share as Frame </h2>
          <Switch
            checked={farcasterStates.isFrame}
            onChange={() =>
              setFarcasterStates({
                ...farcasterStates,
                isFrame: !farcasterStates.isFrame,
              })
            }
            className={`${
              farcasterStates.isFrame ? "bg-[#e1f16b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
          >
            <span
              className={`${
                farcasterStates.isFrame ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Share as Mintable Frame on Farcaster.{" "}
        </div>
      </div>

      <div className="flex flex-col bg-white shadow-2xl rounded-lg rounded-r-none">
        {!getEVMAuth ? (
          <EVMWallets title="Login with EVM" className="mx-2" />
        ) : !isFarcasterAuth ? (
          <FarcasterAuth />
        ) : (
          <div className="mx-2 my-2 outline-none">
            <Button
              className="w-full outline-none"
              onClick={handleSubmit}
              // color="yellow"
            >
              Share
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FarcasterNormalPost;
