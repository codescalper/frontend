import React, { useContext, useEffect, useState } from "react";
import { SharePanelHeaders } from "../components";
import { Switch } from "@headlessui/react";
import { Context } from "../../../../../../providers/context";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../common";
import {
  Button,
  Option,
  Select,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { XCircleIcon } from "@heroicons/react/24/outline";
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
            <Tabs className="overflow-y-auto m-2" value={currentTab}>
              <TabsHeader className="relative top-0 ">
                <Tab value={"ERC1155"} className="appFont" onClick={() => setCurrentTab("ERC1155")}>
                  {" "}
                  ERC1155{" "}
                </Tab>
                <Tab value={"ERC721"} className="appFont" onClick={() => setCurrentTab("ERC721")}>
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

              {zoraTab === "ERC1155" && <ERC1155Edition />}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default ZoraMint;
