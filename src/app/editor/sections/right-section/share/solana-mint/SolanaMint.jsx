import React from "react";
import { SharePanelHeaders } from "../components";
import { InputBox } from "../../../../common";
import { SwitchGroup } from "../components";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { Button } from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";

const SolanaMint = () => {
  return (
    <>
      <SharePanelHeaders
        panelHeader={"Mint Options"}
        panelContent={
          <>
            {/* Switch Number 1 Start */}
            <SwitchGroup
              switchHead="Charge for Mint"
              switchDesc="Set an amount to be charged for mint"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                // onChange={(e) => restrictRecipientInput(e, index, recipient)}
              />
            </div>
            {/* Switch Number 1 End */}

            {/* Switch Number 2 Start */}
            <SwitchGroup
              switchHead="On Chain Splits"
              switchDesc="Split between multiple recipients"
            />
            <div className="ml-4 mr-4 flex flex-row">
              <div className="w-3/4">
                <InputBox
                  placeholder="erc20 address"
                  value={""}
                  // onChange={(e) => restrictRecipientInput(e, index, recipient)}
                />
              </div>
              <div className="w-1/4 ml-2">
                <InputBox
                  placeholder="10%"
                  value={""}
                  // onChange={(e) => restrictRecipientInput(e, index, recipient)}
                />
              </div>
            </div>
            {/* Switch Number 2 End */}

            {/* Switch Number 3 Start */}
            <SwitchGroup
              switchHead="Limit number of editions"
              switchDesc="Limit the number of editions that can be minted"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="100"
                value={""}
                // onChange={(e) => restrictRecipientInput(e, index, recipient)}
              />
            </div>
            {/* Switch Number 3 End */}

            {/* Switch Number 4 Start */}
            <SwitchGroup
              switchHead="Schedule your Mint"
              switchDesc="Set a start and end date for your mint"
            />

            <div className="flex flex-col">

                <div className="ml-4 mr-4 flex justify-between text-center align-middle">
                  <div>Start</div> <DateTimePicker />
                </div>
                <div className="m-4 flex justify-between text-center align-middle">
                  <div>End</div> <DateTimePicker />
                </div>

            </div>
            {/* Switch Number 4 End */}

            {/* Switch Number 4 Start */}
            <SwitchGroup
              switchHead="Allowlist"
              switchDesc="Allow specific contract addresses to mint"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                // onChange={(e) => restrictRecipientInput(e, index, recipient)}
              />

              <Button
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2"
              >
                <BsPlus />
                Add Recipient
              </Button>

              <div className="text-center mt-2"> OR </div>

              <Button className="mt-2" size="sm" variant="outlined" fullWidth>
                {" "}
                Upload CSV{" "}
              </Button>
            </div>
            {/* Switch Number 4 End */}

            {/* Switch Number  Start */}
            <SwitchGroup
              switchHead="NFT Burn"
              switchDesc="Add NFT contract addresses"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                // onChange={(e) => restrictRecipientInput(e, index, recipient)}
              />
            </div>
            {/* Switch Number  End */}

            <SwitchGroup
              switchHead="NFT Gate"
              switchDesc="Add NFT contract addresses to gate"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                // onChange={(e) => restrictRecipientInput(e, index, recipient)}
              />

              <Button
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2"
              >
                <BsPlus />
                Add Recipient
              </Button>
            </div>

            <SwitchGroup
              switchHead="Token Gate"
              switchDesc="Add Token contract addresses to gate"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                // onChange={(e) => restrictRecipientInput(e, index, recipient)}
              />
            </div>
          </>
        }
      />
    </>
  );
};

export default SolanaMint;
