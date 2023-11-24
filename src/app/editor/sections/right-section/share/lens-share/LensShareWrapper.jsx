import React, { useState } from "react";
import { SharePanelHeaders } from "../components";
import { Tabs, Tab, TabsHeader } from "@material-tailwind/react";
import { SmartPost, LensShare } from "./components";

const LensShareWrapper = () => {
  const [currentTab, setCurrentTab] = useState("smartPost");

  return (
    <>
      <SharePanelHeaders
        menuName={"share"}
        panelHeader={"Monetization Settings"}
        panelContent={
          <>
            {/* Tabs for Smart Post / Normal */}
            <Tabs className="overflow-scroll m-2" value={currentTab}>
              <TabsHeader className="relative top-0 ">
                <Tab
                  value={"smartPost"}
                  className="appFont"
                  onClick={() => setCurrentTab("smartPost")}
                >
                  {" "}
                  Smart Post{" "}
                </Tab>
                <Tab
                  value={"normalPost"}
                  className="appFont"
                  onClick={() => setCurrentTab("normalPost")}
                >
                  {" "}
                  Normal{" "}
                </Tab>
              </TabsHeader>

              {currentTab === "smartPost" ? <SmartPost /> : <LensShare />}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default LensShareWrapper;
