
// Imports: 
import React, { useEffect, useRef, useState } from "react";

import { observer } from "mobx-react-lite";
import { InputGroup, Button } from "@blueprintjs/core";
import { svgToURL } from "polotno/utils/svg";
import { SectionTab } from "polotno/side-panel";

import { t } from "polotno/utils/l10n";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { BackgroundIcon, ElementsIcon } from "../editor-icon";
import { useAccount } from "wagmi";
import { getAllCanvas } from "../../services/backendApi";

import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import styled from "polotno/utils/styled";

import { useInfiniteAPI } from "polotno/utils/use-api";
import FaVectorSquare from "@meronex/icons/fa/FaVectorSquare";




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

	const loadImages = async () => {
		setIsLoading(true);

		// getAllcanvas() - CHANGE the Function to that which displays the Backgrounds 
		// For DEV - Currently running the Mydesigns endpoint  
		const res = await getAllCanvas();
		setArrData(res.data);
		console.log(arrData) 
	
		if (res?.data) {
		  setData(res?.data);
		  setIsLoading(false);
		} else if (res?.error) {
		  setIsError(res?.error);
		  setIsLoading(false);
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

	return(<>
		
		In NFT BGs
		{/* Code for NFT BACKGROUNDS here */}
		<ImagesGrid
          images={arrData}
          key={arrData.id}
          getPreview={(image) => image.imageLink[0]}
          onSelect={async (image, pos) => {
            // const { width, height } = await getImageSize(image.url);
            store.activePage.addElement({
              type: "image",
              src: image.imageLink[0],
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
        />


	</>)
})

// New Tab NFT Backgrounds End - 24Jun2023

export const BackgroundPanel2 = observer(({ store, query }) => {

	const [stTab, setStTab] = useState("tabColors")
	const [stInputQuery, setStInputQuery] = useState("")

	return(<>
		
		<div className="flex flex-row">
			
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
			className="m-1 rounded-md border-2 p-2"
			onClick={() => {
				setStTab("tabNFTBgs");
			}}
			active={stTab === "tabNFTBgs"}
			icon="build" >
				NFT Backgrounds
		</Button>
		</div>
		<input
				leftIcon="search"
				placeholder={t("sidePanel.searchPlaceholder")}
				onChange={(e) => {
					setStInputQuery(e.target.value);
					console.log(stInputQuery)
				}}
				className="border-2 rounded-md p-2 m-1 mt-2 w-full"
				type="search"
				style={{
					marginBottom: "20px",
				}}/>
		
		{/* The Tab Elements start to appear here - 24Jun2023 */}
		{stTab === "tabColors" && (
			<TabColors
				query={""}
				store={store}
		/>
		)}
		{stTab === "tabNFTBgs" && (
			<TabNFTBgs
				query={""}
				store={store}
		/>)}

	</>)
})

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
