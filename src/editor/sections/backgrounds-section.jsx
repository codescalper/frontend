// Imports:
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { BackgroundIcon } from "../editor-icon";
import { useAccount } from "wagmi";
import { getBGAssetByQuery } from "../../services/backendApi";
import CustomImageComponent from "../../elements/CustomImageComponent";

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

  const loadImages = async (query) => {
    setIsLoading(true);

    const res = await getBGAssetByQuery(query);
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
      {/* Lazyloading Try - 29Jun2023 */}
      <div className=" h-full overflow-y-auto">
        <div className="grid grid-cols-2 overflow-y-auto">
          {data.map((design) => {
            return (
              <CustomImageComponent
                design={design}
                json={design.data}
                preview={design.image}
                key={design.id}
                store={store}
                project={project}
              />
            );
          })}
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
