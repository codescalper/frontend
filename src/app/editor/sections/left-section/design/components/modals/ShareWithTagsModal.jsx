import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Switch,
  Typography,
} from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import { Context } from "../../../../../../../providers/context";
import { toast } from "react-toastify";
import {
  changeCanvasVisibility,
  tokengateCanvasById,
  updateCanvas,
} from "../../../../../../../services";
import { handleChange } from "../../utils";
import { InputBox } from "../../../../../common";

const ShareWithTagsModal = ({ displayImg, canvasId, isPublic }) => {
  const { designModal, setDesignModal } = useContext(Context);
  const [open, setOpen] = useState(designModal);
  // Store input as tags array
  const [tags, setTags] = useState(["lens", "lenspost"]);
  // Switch States
  const [switchState, setSwitchState] = useState(false);

  // Modal States
  const [modal, setModal] = useState({
    isOpen: false,
    isPublic: isPublic ? true : false,
    isTokengate: false,
    isNewDesign: false,
    stTokengateIpValue: "",
    isError: false,
    errorMsg: "",
    canvasId: canvasId,
  });
  
  console.log("modal.isPublic", modal.isPublic);

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        handler={() => setOpen(!open)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="appFont justify-between border-b border-gray-300">
          <Typography variant="h5" color="blue-gray">
            Make this Design Public
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={() => setDesignModal(false)}
            className="appFont outline-none"
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

        <DialogBody className="m-2">
          <div className=" flex flex-col items-center my-2">
            {displayImg && (
              <img className="h-64 w-fit" src={displayImg} alt="" />
            )}
          </div>

          <div className="flex flex-col justify-start mt-4">
            {/* <div className="">
              Add some creative tags to help others find your design{" "}
            </div> */}
            <Input
              // className="w-full mt-2 border border-gray-300 rounded-md p-2"
              label="Add some creative tags to help others find your design"
              placeholder=""
              value={tags}
              onChange={(e) => {
                setTags(e.target.value);
                console.log(tags);
              }}
            />

            <div className="mt-2 flex justify-between">
              <div className="m-2 ml-0 font-bold appFont">
                {" "}
                Tokengate this Template
              </div>

              <div className="m-2">
                <Switch
                  checked={switchState}
                  onClick={() => setSwitchState(!switchState)}
                  // color="blue"
                />
              </div>
            </div>
            <div className="text-sm font-medium appFont">
              Tokengate this canvas with specific contract address or with a
              Hey(Lenster) post
            </div>
            {switchState && (
              <div className="mt-4">
                {switchState && (
                  <InputBox
                    value={modal?.stTokengateIpValue}
                    onChange={(e) => handleChange(e, modal, setModal)}
                    // placeholder={"contract address / Lenster post link"}
                    label={"Enter contract address / Hey (Lenster) post link"}
                  />
                )}
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="">
            <Button
              variant="filled"
              loading={true}
              // color="blue"
              // onClick={() => setOpen(false)}
              onClick={async () => {
                console.log("tags", tags);
                const splitTags = tags.split(",");

                await updateCanvas({
                  id: modal.canvasId,
                  tags: splitTags,
                });

                await changeCanvasVisibility({
                  id: modal.canvasId,
                  isPublic: !isPublic,
                });

                await tokengateCanvasById({
                  id: modal.canvasId,
                  gatewith: modal.stTokengateIpValue,
                });

                console.log(
                  "modal.stTokengateIpValue",
                  modal.stTokengateIpValue
                );
                console.log("modal.canvasId", modal.canvasId);
                toast.success("Canvas is tokengated and made public"),
                  setDesignModal(false);
              }}
            >
              {/* {switchState ? "Tokengate and Make Public" : " Make Public"} */}
              { modal?.isPublic ? "Make Private" : "Make Public"}

            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ShareWithTagsModal;
