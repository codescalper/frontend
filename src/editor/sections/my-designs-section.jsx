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
  twitterAuth,
} from "../../services/backendApi";

export const MyDesignsPanel = observer(({ store }) => {
  const { isDisconnected, address } = useAccount();
  const [stMoreBtn, setStMoreBtn] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const res = async () => {
    setIsLoading(true);
    await getAllCanvas(address).then((res) => {
        setData(res);
      setIsLoading(false);
    });
  };

  const deleteCanvas = async (id) => {
    const res = await deleteCanvasById("80")
  };

  const twitterAuthentication = async () => {
    // console.log("twitter auth");
    const res = await twitterAuth()
	// console.log("res", res);
  };

  // useEffect(() => {
  //   res();
  // }, []);

  if (isDisconnected) {
    return (
      <>
        <p>Please connect your wallet</p>
      </>
    );
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
            <Button icon="document-open"> Open </Button>
            <Button icon="trash" onClick={deleteCanvas}>
              {" "}
              Delete{" "}
            </Button>
          </div>
        }
      />
      <ImagesGrid
        shadowEnabled={false}
        images={data}
        getPreview={(item) => item.image}
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
