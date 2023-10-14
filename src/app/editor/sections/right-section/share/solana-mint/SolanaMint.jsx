import React, { useState } from "react";
import { SharePanelHeaders } from "../components";
import { InputBox } from "../../../../common";
import { SwitchGroup } from "../components";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { Button } from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";

const SolanaMint = () => {
  // const [ipBoxValue, setIpBoxValue] = useState({mintAmt})

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  return (
    <>
      <SharePanelHeaders
        menuName={"solanaMint"}
        panelHeader={"Mint Options"}
        panelContent={
          <>
            {/* Switch Number 1 Start */}
            <SwitchGroup
              switchHead="Charge for Mint"
              switchDesc="Set an amount to be charged for mint"
            />
            <div className="ml-4 mr-4 flex ">
              <InputBox
                className={"W-3/4"}
                placeholder="erc20 address"
                value={""}
                onChange={handleChange}
              />

              <div className="flex flex-col w-1/4">
                {/* <label htmlFor="price"></label> */}
                <select
                  name="chargeForCollectCurrency"
                  id="chargeForCollectCurrency"
                  className=" ml-4 p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleChange}
                >
                  <option>SOL</option>
                  <option>ETH</option>
                  {/* {tokenList().map((token, index) => {
                            return (
                              <option key={index} value={token.symbol}>
                                {token.name}
                              </option>
                            );
                          })} */}
                </select>
              </div>
            </div>
            {/* </div> */}
            {/* Switch Number 1 End */}

            {/* Switch Number 2 Start */}
            <SwitchGroup
              switchHead="On Chain Splits"
              switchDesc="Split between multiple recipients"
            />
            <div className="">
              <div className="ml-4 mr-4 flex flex-row">
                <div className="w-3/4">
                  <InputBox
                    placeholder="erc20 address"
                    value={""}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/4 ml-2">
                  <InputBox
                    placeholder="10%"
                    value={""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2 ml-4 mr-4 "
              >
                <BsPlus />
                Add Recipient
              </Button>
            </div>
            {/* Switch Number 2 End */}

            {/* Switch Number 3 Start */}
            <SwitchGroup
              switchHead="Limit number of editions"
              switchDesc="Limit the number of editions that can be minted"
            />
            <div className="ml-4 mr-4">
              <InputBox placeholder="100" value={""} onChange={handleChange} />
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
                onChange={handleChange}
              />

              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2"
              >
                <BsPlus />
                Add Recipient
              </Button>

              <div className="text-center mt-2"> OR </div>

              <Button
                color="teal"
                className="mt-2"
                size="sm"
                variant="outlined"
                fullWidth
              >
                {" "}
                Upload CSV{" "}
              </Button>
            </div>
            {/* Switch Number 4 End */}

            {/* Switch Number 5 Start */}
            <SwitchGroup
              switchHead="NFT Burn"
              switchDesc="Add NFT contract addresses"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                onChange={handleChange}
              />

              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2"
              >
                <BsPlus />
                Contract Address
              </Button>
            </div>
            {/* Switch Number 5 End */}

            {/* Switch Number 6 Start */}
            <SwitchGroup
              switchHead="NFT Gate"
              switchDesc="Add NFT contract addresses to gate"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                onChange={handleChange}
              />

              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2"
              >
                <BsPlus />
                Contract Address
              </Button>
            </div>
            {/* Switch Number 6 End */}

            {/* Switch Number 7 Start */}
            <SwitchGroup
              switchHead="Token Gate"
              switchDesc="Add Token contract addresses to gate"
            />
            <div className="ml-4 mr-4">
              <InputBox
                placeholder="erc20 address"
                value={""}
                onChange={handleChange}
              />
              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2"
              >
                <BsPlus />
                Contract Address
              </Button>
            </div>
            {/* Switch Number 7 End */}
          </>
        }
      />
    </>
  );
};

export default SolanaMint;
