import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import {
  getProfileData,
  lensAuthenticate,
  lensChallenge,
} from "../../../../../../../services";
import { useAccount, useSignMessage } from "wagmi";
import { Context } from "../../../../../../../providers/context";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { errorMessage, saveToLocalStorage } from "../../../../../../../utils";
import { LOCAL_STORAGE } from "../../../../../../../data";

const LensAuthDialog = ({ title, className }) => {
  const [open, setOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState({
    id: "",
    handle: "",
  });
  const { address } = useAccount();
  const { lensAuthState, setLensAuthState } = useContext(Context);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(!open);

  const {
    data: signature,
    isError,
    isSuccess,
    error,
    signMessage,
  } = useSignMessage();

  const { mutateAsync: mutateLensAuth } = useMutation({
    mutationKey: "lensAuth",
    mutationFn: lensAuthenticate,
    onError: (err) => {
      console.log(err);
    },
  });

  // get lens profile data
  const handleLensProfileData = async () => {
    try {
      setLoading(true);
      const res = await getProfileData(address);
      const items = res?.profilesManaged?.items;
      setLensAuthState((cur) => ({
        ...cur,
        lensProfileData: items,
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // generating signature
  const generateSignature = async (profileId) => {
    try {
      setLensAuthState((cur) => ({
        ...cur,
        loading: {
          isLoading: true,
          text: "Generating signature...",
        },
      }));
      const res = await lensChallenge(address, profileId);
      const id = res?.challenge?.id;
      const message = res?.challenge?.text;

      setLensAuthState((cur) => ({
        ...cur,
        id: id,
      }));

      signMessage({
        message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // authenticating signature on lens
  const lensAuth = async () => {
    mutateLensAuth({
      profileId: activeProfile.id,
      profileHandle: activeProfile.handle,
      id: lensAuthState.id,
      signature: signature,
    })
      .then((res) => {
        if (res?.status === "success") {
          saveToLocalStorage(LOCAL_STORAGE.lensAuth, res?.message);
          toast.success("Successfully authenticated");
          setLensAuthState((cur) => ({
            ...cur,
            loading: {
              isLoading: false,
              text: "",
            },
          }));
        }
      })
      .catch((err) => {
        console.log(err);
        handleOpen();
        toast.error(errorMessage(err));
        setLensAuthState((cur) => ({
          ...cur,
          loading: {
            isLoading: false,
            text: "",
          },
        }));
      });
  };

  useEffect(() => {
    if (open) {
      handleLensProfileData();
    }
  }, [open]);

  useEffect(() => {
    if (isError && error?.name === "UserRejectedRequestError") {
      handleOpen();
      setLensAuthState((cur) => ({
        ...cur,
        loading: {
          isLoading: false,
          text: "",
        },
      }));
      toast.error("User rejected the signature request");
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      lensAuth();
    }
  }, [isSuccess]);

  return (
    <>
      <Button
        onClick={handleOpen}
        // variant="gradient"
        className={`bg-[#e1f16b] text-black mx-2 outline-none ${className}`}
      >
        {title}
      </Button>
      <Dialog
        open={open}
        handler={lensAuthState.loading.isLoading ? null : handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="justify-between border-b border-gray-300">
          <Typography variant="h5" color="blue-gray">
            Login with Lens
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={lensAuthState.loading.isLoading ? null : handleOpen}
            className="outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <Typography variant="h6" color="blue-gray">
            Select a Lens profile and sign the message.
          </Typography>
          {loading && (
            <div className="flex items-center justify-center rounded-lg border my-2 p-3">
              <Typography variant="h6" color="blue-gray">
                Fetching lens profile profiles...
              </Typography>
            </div>
          )}
          {lensAuthState.lensProfileData.length > 0
            ? !loading &&
              lensAuthState.lensProfileData.map((item) => {
                const handle = item?.handle?.localName;
                return (
                  <div
                    key={item.id}
                    className="rounded-lg w-full h-full border p-3 my-2 text-black cursor-pointer hover:bg-blue-gray-50 flex items-center justify-between"
                    onClick={() => {
                      generateSignature(item.id);
                      setActiveProfile({
                        id: item.id,
                        handle: handle,
                      });
                    }}
                  >
                    <Typography variant="h6" color="blue-gray">
                      @{handle}
                    </Typography>
                    {lensAuthState.loading.isLoading &&
                    activeProfile.id === item.id ? (
                      <Spinner color="red" />
                    ) : null}
                  </div>
                );
              })
            : !loading && (
                <div className="flex items-center justify-center rounded-lg border my-2 p-3">
                  <Typography variant="h6" color="blue-gray">
                    No Lens profile found
                  </Typography>
                </div>
              )}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default LensAuthDialog;
