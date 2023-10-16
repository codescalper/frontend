import React, { useState } from "react";
import { useStore } from "../../../../../hooks/polotno";
import { Button } from "@blueprintjs/core";
import { replaceImageURL } from "../../../../../utils";
import { getRemovedBgS3Link } from "../../../../../services";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useAppAuth } from "../../../../../hooks/app";

const BgRemover = () => {
  const store = useStore();
  const { isAuthenticated } = useAppAuth();
  const [stActivePageNo, setStActivePageNo] = useState(0);
  var varActivePageNo = 0;

  const handleRemoveBg = async () => {
    const varImageUrl = store.selectedElements[0]?.src;
    fnFindPageNo();

    var removedBgURL = await fnRemoveBg(varImageUrl);
    // // To Fix CORS error, we append the string with b-cdn url
    fnAddImageToCanvas(`${replaceImageURL(removedBgURL)}`, varActivePageNo);

    return removedBgURL;
  };

  // Find the index of the page for which the removed background image needs to be placed
  const fnFindPageNo = () => {
    store.pages.map((page) => {
      page.identifier == store._activePageId;
      setStActivePageNo(store.pages.indexOf(page));
      varActivePageNo = store.pages.indexOf(page);
    });
  };
  // Function to Add Removed BG image on the Canvas
  const fnAddImageToCanvas = async (removedBgUrl, varActivePageNo) => {
    // Add the new removed Bg Image to the Page

    await store.pages[stActivePageNo || varActivePageNo].addElement({
      type: "image",
      x: 0.5 * store.width,
      y: 0.5 * store.height,
      width: store.selectedElements[0].width,
      height: store.selectedElements[0].height,
      src: removedBgUrl,
      selectable: true,
      draggable: true,
      removable: true,
      resizable: true,
      showInExport: true,
    });
  };

  const fnRemoveBg = async (varImageUrl) => {
    const res = await getRemovedBgS3Link(varImageUrl);
    if (res?.data) {
      return res.data.s3link;
    }
  };

  //  Toast Setup
  const fnCallToast = async () => {
    // check if image is selected on canvas
    const varImageUrl = store.selectedElements[0]?.src;
    if (varImageUrl === undefined) {
      toast.error("Please select an image to remove background");
      return;
    }
    const id = toast.loading("Removing Background", { autoClose: 4000 });
    const res = await handleRemoveBg();
    if (res) {
      toast.update(id, {
        render: "Removed Background", //Check if The toast is working
        type: "success",
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
      });
    } else if (!res) {
      toast.update(id, {
        render: "Error in removing background",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
      });
    }
  };
  return (
    <div className="">
      <Button
        id="fourth-step"
        icon="clean"
        onClick={fnCallToast}
        title={!isAuthenticated ? "" : "Please connect your wallet"}
        disabled={!isAuthenticated}
        className="mt-2 mb-2 ml-3 py-1 px-4"
      >
        {`Remove background`}
      </Button>
    </div>
  );
};

export default BgRemover;
