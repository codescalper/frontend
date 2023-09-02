// Imports:
import React, { useState } from "react";
import { Button } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { BackgroundIcon } from "../../../../../assets";
import { getBGAssetByQuery } from "../../../../../services";
import { Tabs } from "../../../common";
import { firstLetterCapital } from "../../../../../utils";

export const BannerPanel = () => {
  const [currentTab, setCurrentTab] = useState("supducks");
  const tabArray = ["supducks", "moonrunners"];

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row h-fit">
        {tabArray.map((tab, index) => (
          <Button
            key={index}
            className="m-2 rounded-md border-2 px-2"
            onClick={() => {
              setCurrentTab(tab);
            }}
            active={currentTab === tab}
            // icon="build"
          >
            {firstLetterCapital(tab)}
          </Button>
        ))}
      </div>

      <Tabs
        defaultQuery={currentTab}
        getAssetsFn={getBGAssetByQuery}
        queryKey="backgrounds"
      />
    </div>
  );
};

// define the new custom section
const BannerSection = {
  name: "Backgrounds2",
  Tab: (props) => (
    <SectionTab name={`NFT ${"\n"} Banners`} {...props}>
      <BackgroundIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: BannerPanel,
};

export default BannerSection;
