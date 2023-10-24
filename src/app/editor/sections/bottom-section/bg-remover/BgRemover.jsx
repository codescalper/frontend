import React, { useContext, useState } from "react";
import { useStore } from "../../../../../hooks/polotno";
import { Button } from "@blueprintjs/core";
import { replaceImageURL } from "../../../../../utils";
import { getRemovedBgS3Link } from "../../../../../services";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useAppAuth } from "../../../../../hooks/app";
import { Context } from "../../../../../providers/context";

const BgRemover = () => {
  const store = useStore();
  const { isAuthenticated } = useAppAuth();
  const [stActivePageNo, setStActivePageNo] = useState(0);
  const { parentRecipientDataRef, bgRemoverRecipientDataRef } =
    useContext(Context);
  var varActivePageNo = 0;

  const handleRemoveBg = async () => {
    const varImageUrl = store.selectedElements[0]?.src;
    var elementId = store.selectedElements[0]?.id;
    fnFindPageNo();

    var removedBgURL = await fnRemoveBg(varImageUrl, elementId);

    if (removedBgURL?.error) return;

    // // To Fix CORS error, we append the string with b-cdn url
    fnAddImageToCanvas(
      `${replaceImageURL(removedBgURL?.url)}`,
      varActivePageNo
    );

    // update the parentRecipientDataRef with the removed bg nft/asset/image data
    elementId = store.selectedElements[0]?.id;
    fnUpdateRecipientDataRef(removedBgURL?.elementId, elementId);

    return removedBgURL?.url;
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

  const fnRemoveBg = async (varImageUrl, elementId) => {
    const res = await getRemovedBgS3Link(varImageUrl, elementId);
    if (res?.data) {
      return {
        url: res?.data?.s3link,
        elementId: res?.data?.id,
      };
    } else if (res?.error) {
      return {
        error: res?.error,
      };
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
    const id = toast.loading("Removing Background", { autoClose: 3000 });
    const res = await handleRemoveBg();
    if (res) {
      toast.update(id, {
        render: "Removed Background", //Check if The toast is working
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } else if (!res) {
      toast.update(id, {
        render: "Error in removing background",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }
  };

  // fumction to update the parentRecipientDataRef with the removed bg nft/asset/image data
  const fnUpdateRecipientDataRef = async (preElementId, newElementId) => {
    // check if preElementId is present in the parentRecipientDataRef
    const arr = parentRecipientDataRef.current;

    // if preElementId is present in the parentRecipientDataRef, then add the newElementId to the parentRecipientDataRef with that recipient
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].elementId == preElementId) {
        bgRemoverRecipientDataRef.current.push({
          elementId: newElementId,
          handle: arr[i].handle,
        });
        break;
      }
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
