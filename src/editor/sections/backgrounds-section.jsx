// Imports:

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { InputGroup, Button } from "@blueprintjs/core";
import { isAlive } from "mobx-state-tree";

import { svgToURL } from "polotno/utils/svg";
import { SectionTab } from "polotno/side-panel";
import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import styled from "polotno/utils/styled";
import { t } from "polotno/utils/l10n"; 
import { useInfiniteAPI } from "polotno/utils/use-api";
import FaVectorSquare from "@meronex/icons/fa/FaVectorSquare";

import { ImagesGrid } from "polotno/side-panel/images-grid";
import { BackgroundIcon, ElementsIcon } from "../editor-icon";

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
  return (
    <>
      In NFT BGs
      {/* Code for NFT BACKGROUNDS here */}
    </>
  );
});

// New Tab NFT Backgrounds End - 24Jun2023

export const BackgroundPanel2 = observer(({ store, query }) => {
  const [stTab, setStTab] = useState("tabColors");
  const [stInputQuery, setStInputQuery] = useState("");

  return (
    <>
      <div className="flex flex-row">
        <Button
          className="m-1 rounded-md border-2 p-2"
          onClick={() => {
            setStTab("tabColors");
          }}
          active={stTab === "tabColors"}
          icon="color-fill"
        >
          Colors
        </Button>
        <Button
          className="m-1 rounded-md border-2 p-2"
          onClick={() => {
            setStTab("tabNFTBgs");
          }}
          active={stTab === "tabNFTBgs"}
          icon="build"
        >
          NFT Backgrounds
        </Button>
      </div>
      <input
        leftIcon="search"
        placeholder={t("sidePanel.searchPlaceholder")}
        onChange={(e) => {
          setStInputQuery(e.target.value);
          console.log(stInputQuery);
        }}
        className="border-2 rounded-md p-2 m-1 mt-2 w-full"
        type="search"
        style={{
          marginBottom: "20px",
        }}
      />

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
