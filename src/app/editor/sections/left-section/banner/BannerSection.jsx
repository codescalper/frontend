// Imports:
import React, { useEffect, useState } from "react";
import { Button } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { Tabs as TabsCustom, } from "../../../common"; // Since Material already has builtin component `Tab`
import { firstLetterCapital } from "../../../../../utils";
import CgImage from "@meronex/icons/cg/CgImage";
import FeaturedTabs from "../../../common/core/FeaturedTabs";
import { getAssetByQuery, getFeaturedAssets } from "../../../../../services";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export const BannerPanel = () => {
  // const [currentTab, setCurrentTab] = useState("supducks");
  const [currentTab, setCurrentTab] = useState("halloween");
  const tabArray = ["halloween","lensjump", "supducks", "moonrunners"];
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
      {/* <div className="flex flex-row h-fit">

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
      </div> */}

      {/* New Material Tailwind Buttons / Tabs : */}
      {/* Reference Link: https://www.material-tailwind.com/docs/react/tabs */}

      <Tabs id="custom-animation" value="halloween">
        <div className="w-100 overflow-scroll m-2">
          <TabsHeader
          // className="bg-transparent"
          // indicatorProps={{
          //   className: "bg-gray-900/10 shadow-none !text-gray-900",
          // }}
          >
            {tabArray.map((tab, index) => (
              <Tab
                value={tab}
                onClick={() => {
                  setCurrentTab(tab);
                }}
              >
                <div className="appFont">
                  {" "}
                  {firstLetterCapital(tab)}{" "}
                </div>
              </Tab>
            ))}
          </TabsHeader>
        </div>
        {/* <div className="h-full overflow-y-scroll"> */}
        <div className="hCustom overflow-y-scroll">
          <TabsBody
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            {/* <TabPanel key={currentTab} value={currentTab}> */}

            <TabsCustom
              changeCanvasDimension={true}
              defaultQuery={currentTab}
              getAssetsFn={
                currentTab === "lensjump" ? getFeaturedAssets : getAssetByQuery
              }
              queryKey="backgrounds"
            />
          </TabsBody>
        </div>
      </Tabs>
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
