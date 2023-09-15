// Imports:
import React, { useEffect, useState } from "react";
import { Button } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { Tabs } from "../../../common";
import { firstLetterCapital } from "../../../../../utils";
import CgImage from "@meronex/icons/cg/CgImage";
import FeaturedTabs from "../../../common/core/FeaturedTabs";
import { getAssetByQuery, getFeaturedAssets } from "../../../../../services";

export const BannerPanel = () => {
  // const [currentTab, setCurrentTab] = useState("supducks");
  const [currentTab, setCurrentTab] = useState("lensjump");
  const tabArray = ["lensjump", "supducks", "moonrunners"];
  // const [isFeatured, setIsFeatured] = useState(false);

  // const fnGetBGAssets = () => {
  //   if(isFeatured){
  //     return getFeaturedBGAssets();
  //   }
  //   else{
  //     return getBGAssetByQuery(currentTab);
  //   }
  // }

  // useEffect(() => {
  //   fnGetBGAssets;
  // }, [currentTab, isFeatured]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row h-fit">
        {/* <Button
            className="m-2 rounded-md border-2 px-2"
            onClick={() => { setCurrentTab("lensjump"); }}
            active={currentTab === "lensjump"}
          >
            Lensjump
          </Button> */}

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
        changeCanvasDimension={true}
        defaultQuery={currentTab}
        getAssetsFn={
          currentTab === "lensjump" ? getFeaturedAssets : getAssetByQuery
        }
        queryKey="backgrounds"
      />
      {/* )} */}
    </div>
  );
};

// define the new custom section
const BannerSection = {
  name: "Backgrounds2",
  Tab: (props) => (
    <SectionTab name={`NFT ${"\n"} Banners`} {...props}>
      <CgImage size="16" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: BannerPanel,
};

export default BannerSection;
