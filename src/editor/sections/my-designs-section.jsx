import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteAPI } from "polotno/utils/use-api";

import { SectionTab } from "polotno/side-panel";

import { ImagesGrid } from "polotno/side-panel/images-grid";
import { TemplatesIcon } from "../editor-icon";

//Icons Import
import { Icon, IconSize, Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useAccount } from "wagmi";
import {
  deleteCanvasById,
  getAllCanvas,
  getCanvasById,
} from "../../services/backendApi";
import { toast } from "react-toastify";

export const MyDesignsPanel = observer(({ store }) => {
  const { isDisconnected, address, isConnected } = useAccount();
  const [stMoreBtn, setStMoreBtn] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const loadImages = async () => {
    setIsLoading(true);
    const res = await getAllCanvas();
    if (res?.data) {
      setData(res?.data);
      setIsLoading(false);
    } else if (res?.error) {
      setIsError(res?.error);
      setIsLoading(false);
    }
  };

  const deleteCanvas = async (canvasId) => {
    const res = await deleteCanvasById(canvasId);
    if (res?.data) {
      toast.success(res?.data?.message);
    } else if (res?.error) {
      toast.error(res?.error);
    }
  };

  useEffect(() => {
    if (isDisconnected) return;
    loadImages();
  }, [isConnected]);

  if (isDisconnected || !address) {
    return (
      <>
        <p>Please connect your wallet</p>
      </>
    );
  }

  if (isError) {
    return <div>{isError}</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg">My Designs</h1>
      <Button> Create new design </Button>

      <Popover2
        interactionKind="click"
        isOpen={stMoreBtn}
        renderTarget={({ isOpen, ref, ...targetProps }) => (
          <Button
            {...targetProps}
            elementRef={ref}
            onClick={() => setStMoreBtn(!stMoreBtn)}
            intent="none"
          >
            {" "}
            <Icon icon="more" />{" "}
          </Button>
        )}
        content={
          <div>
            <Button icon="document-open"> Share </Button>
            <Button onClick={() => deleteCanvas("4")} icon="trash">
              {" "}
              Delete{" "}
            </Button>
          </div>
        }
      />
      <ImagesGrid
        shadowEnabled={false}
        images={data}
        getPreview={(item) => item?.imageLink != null && item?.imageLink[0]}
        isLoading={isLoading}
        onSelect={async (item) => {
          // download selected json
          const json = item.data;
          // const json = req.json();
          // just inject it into store
          store.loadJSON(json);
        }}
        rowsNumber={1}
      />
    </div>
  );
});

// define the new custom section
export const MyDesignsSection = {
  name: "My Designs",
  Tab: (props) => (
    <SectionTab name="My Designs" {...props}>
      <TemplatesIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: MyDesignsPanel,
};
