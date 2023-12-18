import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Spinner,
  Checkbox,
} from "@material-tailwind/react";
import { ZoraLogo } from "../../../../../../../assets";
import { zoraURLErc721 } from "../utils/zoraURL";
import { useReset } from "../../../../../../../hooks/app";
import { useNetwork } from "wagmi";

const ZoraDialog = ({
  isError,
  isLoading,
  isPending,
  data,
  isSuccess,
  isCreatingSplit,
  isUploadingToIPFS,
  OAisLoading,
  OAisSuccess,
  isOpenAction,
}) => {
  const [open, setOpen] = useState(false);
  const { resetState } = useReset();
  const { chain } = useNetwork();

  const handleOpen = () => setOpen(!open);

  // if loading show the dialog
  useEffect(() => {
    if (isUploadingToIPFS) {
      handleOpen();
    }
  }, [isUploadingToIPFS]);

  // if error close the dialog
  useEffect(() => {
    if (isError) {
      setOpen(false);
    }
  }, [isError]);

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="outline-none"
      >
        <DialogHeader className="gap-2 border-b border-gray-300">
          <img src={ZoraLogo} alt="zora logo" className="h-10 w-10" />
          <Typography variant="h5" color="blue-gray">
            Zora ERC721 Edition
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-2 justify-between">
            <Typography variant="h6" color="blue-gray">
              {isUploadingToIPFS && "Uploading to IPFS..."}
              {isCreatingSplit &&
                "Confirm the transaction to create the split..."}
              {isLoading && "Confirm the transaction to create the Edition..."}
              {isPending && "Transaction is pending..."}
              {OAisLoading && "Creating Lens open action..."}
              {isOpenAction
                ? OAisSuccess && <>Open Action is created successfully.</>
                : isSuccess && (
                    <>
                      Transaction is successful. <br />
                      <span className="text-md">
                        Check your edition on{" "}
                        <a
                          href={zoraURLErc721(
                            data?.logs[0]?.address,
                            chain?.id
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500"
                        >
                          Zora
                        </a>
                      </span>
                    </>
                  )}
            </Typography>
            {(isUploadingToIPFS ||
              isCreatingSplit ||
              isLoading ||
              isPending ||
              OAisLoading) && <Spinner color="blue" />}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            disabled={
              isUploadingToIPFS ||
              isCreatingSplit ||
              isLoading ||
              isPending ||
              OAisLoading
            }
            color="teal"
            onClick={() => {
              handleOpen();
              resetState();
            }}
            ripple="light"
            className="ml-4 outline-none"
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ZoraDialog;
