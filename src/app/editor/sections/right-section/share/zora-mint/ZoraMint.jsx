import React, { useContext } from "react";
import { SharePanelHeaders } from "../components";
import { Context } from "../../../../../../providers/context";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
} from "@material-tailwind/react";
import { ERC1155Edition, ERC721Edition } from "./components";

const ZoraMint = () => {
  const { zoraTab, setZoraTab } = useContext(Context);

  return (
    <>
      <SharePanelHeaders
        menuName={"zoraMint"}
        panelHeader={"Mint Options"}
        panelContent={
          <>
            <Tabs className="overflow-y-auto my-2" value={zoraTab}>
              <TabsHeader className="relative top-0 ">
                <Tab value={"ERC721"} className="appFont" onClick={() => setZoraTab("ERC721")}>
                  {" "}
                  ERC721{" "}
                </Tab>
                <Tab value={"ERC1155"} onClick={() => setZoraTab("ERC1155")}>
                  {" "}
                  ERC1155{" "}
                </Tab>
              </TabsHeader>

              {/* add components */}
              {zoraTab === "ERC721" && <ERC721Edition />}

              {zoraTab === "ERC1155" && (
                <h1 className="text-center text-xl mt-10">Coming soon</h1>
              )}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default ZoraMint;
