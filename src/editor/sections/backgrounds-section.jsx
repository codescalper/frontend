// Imports:
import React, { useEffect, useRef, useState, useContext } from "react";

import { observer } from "mobx-react-lite";
import {
  InputGroup,
  Button,
  Card,
  Menu,
  Spinner,
  MenuItem,
  Position,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { svgToURL } from "polotno/utils/svg";
import { SectionTab } from "polotno/side-panel";

import { t } from "polotno/utils/l10n";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { BackgroundIcon, ElementsIcon } from "../editor-icon";
import { useAccount } from "wagmi";
import { getAllCanvas, getBGAssetByQuery } from "../../services/backendApi";

import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import styled from "polotno/utils/styled";

import { useInfiniteAPI } from "polotno/utils/use-api";
import FaVectorSquare from "@meronex/icons/fa/FaVectorSquare";
import { LazyLoadImage } from "react-lazy-load-image-component";

// Seperate component for Lazy loading (CustomImage) - 29Jun2023
// Custom Image card component start - 23Jun2023
const CustomImage = observer(
  ({ design, project, preview, json, onDelete, onPublic, store }) => {
    // const { setCanvasId } = useContext(Context);

    const fnDropImageOnCanvas = () => {
      store.activePage.addElement({
        type: "image",
        src: preview, //Image URL
        width: store.width,
        height: store.height,
        // x: store.width / 2 ,
        // y: pos ? pos.y : store.height / 2 - height / 2,
      });
      element.set({ clipSrc: preview });
    };

    return (
      <Card
        style={{ margin: "4px", padding: "0px", position: "relative" }}
        interactive
        onDragEnd={() => {
          fnDropImageOnCanvas();
        }}
        onClick={() => {
          fnDropImageOnCanvas();
        }}
      >
        <div
          className=""
          onClick={() => {
            // handle onClick
            // setCanvasId(design.id);
            // store.loadJSON(json);
          }}
        >
          <LazyLoadImage
            src={preview}
            alt="Preview Image"
            style={{ width: "100%" }}
            opacity
          />
        </div>
      </Card>
    );
  }
);
// Custom Image card component end - 23Jun2023

// New Tab Colors Start - 24Jun2023
export const TabColors = observer(({ store, query }) => {
  return (
    <>
      In Colors
      {/* Code for Colors here */}
    </>
  );
});

// New Tab Colors End - 24Jun2023

// New Tab NFT Backgrounds Start - 24Jun2023
export const TabNFTBgs = observer(({ store, query }) => {
  const { isDisconnected, address, isConnected } = useAccount();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [arrData, setArrData] = useState([]);

  const loadImages = async (query) => {
    setIsLoading(true);

    const res = await getBGAssetByQuery(query);
    if (res?.data) {
      setArrData(res?.data);
      setIsLoading(false);
    } else if (res?.error) {
      setIsError(res?.error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDisconnected) return;
    loadImages("supducks");
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
    <>
      {/* Code for NFT BACKGROUNDS here */}
      {/* <ImagesGrid
        images={arrData}
        key={arrData.id}
        getPreview={(item) => item?.image}
        onSelect={async (item, pos) => {
          const { width, height } = await getImageSize(item?.image);
          store.activePage.addElement({
            type: "image",
            src: item.image,
            //   width,
            //   height,
            // if position is available, show image on dropped place
            // or just show it in the center
            x: pos ? pos.x : store.width / 2 - width / 2,
            y: pos ? pos.y : store.height / 2 - height / 2,
          });
        }}
        rowsNumber={2}
        isLoading={isLoading}
        loadMore={false}
      /> */}

      {/* Lazyloading Try - 29Jun2023 */}

    <div className=" h-full overflow-y-auto" >
      <div className="grid grid-cols-2 overflow-y-auto">

      {arrData.map((design) => { 
        return(
        <CustomImage
        design={design}
        json={design.data}
        preview={
          // design?.imageLink != null &&
          // design?.imageLink.length > 0 &&
                // design?.imageLink[0]w
        design.image
        }
        key={design.id}
        store={store}
        project={project}
        // onDelete={() => deleteCanvas(design.id)}
        // onPublic={() => changeVisibility(design.id)}
        />)})}

        </div>
    </div> 
    </>

  );
});

// New Tab NFT Backgrounds End - 24Jun2023

export const BackgroundPanel2 = observer(({ store, query }) => {
  const [stTab, setStTab] = useState("tabNFTBgs");
  const [stInputQuery, setStInputQuery] = useState("");

  return (
    <>
      <div className="flex flex-row overflow-y-scroll h-fit">
        {/* <Button
			className="m-1 rounded-md border-2 p-2"
			onClick={() => {
				setStTab("tabColors");
			}}
			active={stTab === "tabColors"}
			icon="color-fill">
				Colors
		</Button> */}
        <Button
          className="m-2 rounded-md border-2 px-2"
          onClick={() => {
            setStTab("tabNFTBgs");
          }}
          active={stTab === "tabNFTBgs"}
          icon="build"
        >
          NFT Backgrounds
        </Button>
      </div>

      <div className="flex flex-row justify-normal">
        <input
          className="border px-2 py-1 rounded-md w-full m-1 mb-4 mt-4"
          placeholder="Search by Token ID"
          onChange={(e) => setStInputQuery(e.target.value)}
        />
        <Button
          className="ml-3 m-1 rounded-md mb-4 mt-4"
          icon="search"
          onClick={
            () => console.log(stInputQuery)
            // Implement Search Function here
          }
        ></Button>
      </div>

      {/* The Tab Elements start to appear here - 24Jun2023 */}
      {stTab === "tabColors" && <TabColors query={""} store={store} />}
      {stTab === "tabNFTBgs" && <TabNFTBgs query={""} store={store} />}
    </>
  );
});

// define the new custom section
export const BackgroundSection2 = {
  name: "Backgrounds2",
  Tab: (props) => (
    <SectionTab name="Backgrounds2" {...props}>
      <BackgroundIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: BackgroundPanel2,
};
