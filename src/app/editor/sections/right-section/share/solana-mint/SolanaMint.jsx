import React, { useState } from "react";
import { SharePanelHeaders } from "../components";
import { InputBox } from "../../../../common";
import { SwitchGroup } from "../components";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { Button } from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import { useContext } from "react";
import { Context } from "../../../../../../context/ContextProvider";
import { useEffect } from "react";
import { Switch } from "@headlessui/react";

const SolanaMint = () => {
  // const [ipBoxValue, setIpBoxValue] = useState({mintAmt})
  const {
    enabled,
    setEnabled,
    chargeForMint,
    onChainSplits,
    limitNoOfEditions,
  } = useContext(Context);
  const handleChange = (e) => {
    console.log(e.target.value);
  };

  // useEffect(() => {
  //   console.log(enabled.onChainSplits);
  // }, enabled);

  return (
    <>
      <SharePanelHeaders
        menuName={"solanaMint"}
        panelHeader={"Mint Options"}
        panelContent={
          <>
            {/* Switch Number 1 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Charge for mint </h2>
                <Switch
                  checked={enabled.chargeForMint}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      chargeForMint: !enabled.chargeForMint,
                    })
                  }
                  className={`${
                    enabled.chargeForMint ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.chargeForMint ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Set an amount to be charged for minting{" "}
              </div>
            </div>
            <div
              className={`${!enabled.chargeForMint && "hidden"} ml-4 mr-4 flex`}
            >
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
            {/* <SwitchGroup
              mintOption={onChainSplits}
              switchHead="On Chain Splits"
              switchDesc="Split between multiple recipients"
            /> */}

            {/* Working Start */}

            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> On Chain Splits </h2>
                <Switch
                  checked={enabled.onChainSplits}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      onChainSplits: !enabled.onChainSplits,
                    })
                  }
                  className={`${
                    enabled.onChainSplits ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.onChainSplits ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Split between multiple recipients{" "}
              </div>
            </div>

            {/* {enabled.onChainSplits && ( */}
            <div className={`${!enabled.onChainSplits && "hidden"}`}>
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
            {/* )} */}
            {/* Switch Number 2 End */}
            {/* Working End */}

            {/* Switch Number 3 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Limit number of editions </h2>
                <Switch
                  checked={enabled.limitNoOfEditions}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      limitNoOfEditions: !enabled.limitNoOfEditions,
                    })
                  }
                  className={`${
                    enabled.limitNoOfEditions ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.limitNoOfEditions
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Limit the number of editions that can be minted{" "}
              </div>
            </div>

            <div
              className={`${!enabled.limitNoOfEditions && "hidden"} ml-4 mr-4`}
            >
              <InputBox placeholder="100" value={""} onChange={handleChange} />
            </div>
            {/* Switch Number 3 End */}

            {/* Switch Number 4 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Schedule your Mint </h2>
                <Switch
                  checked={enabled.scheduleMint}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      scheduleMint: !enabled.scheduleMint,
                    })
                  }
                  className={`${
                    enabled.scheduleMint ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.scheduleMint ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Set a start and end date for your mint{" "}
              </div>
            </div>

            <div
              className={`flex flex-col ${!enabled.scheduleMint && "hidden"} `}
            >
              <div className="ml-4 mr-4 flex justify-between text-center align-middle">
                <div>Start</div> <DateTimePicker />
              </div>
              <div className="m-4 flex justify-between text-center align-middle">
                <div>End</div> <DateTimePicker />
              </div>
            </div>
            {/* Switch Number 4 End */}

            {/* Switch Number 4 Start */}
            {/* <SwitchGroup
              switchHead="Allowlist"
              switchDesc="Allow specific contract addresses to mint"
            /> */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Allowlist </h2>
                <Switch
                  checked={enabled.allowlist}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      allowlist: !enabled.allowlist,
                    })
                  }
                  className={`${
                    enabled.allowlist ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.allowlist ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Allow specific contract addresses to mint{" "}
              </div>
            </div>

            <div className={`ml-4 mr-4 ${!enabled.allowlist && "hidden"} `}>
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
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> NFT Burn </h2>
                <Switch
                  checked={enabled.nftBurn}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      nftBurn: !enabled.nftBurn,
                    })
                  }
                  className={`${
                    enabled.nftBurn ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.nftBurn ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add NFT Contract Addresses{" "}
              </div>
            </div>
            <div className={`${!enabled.nftBurn && "hidden"} ml-4 mr-4 `}>
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
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> NFT Gate </h2>
                <Switch
                  checked={enabled.nftGate}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      nftGate: !enabled.nftGate,
                    })
                  }
                  className={`${
                    enabled.nftGate ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.nftGate ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add NFT contract addresses to gate{" "}
              </div>
            </div>
            <div className={`${!enabled.nftGate && "hidden"} ml-4 mr-4 `}>
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
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Token Gate </h2>
                <Switch
                  checked={enabled.tokenGate}
                  onChange={() =>
                    setEnabled({
                      ...enabled,
                      tokenGate: !enabled.tokenGate,
                    })
                  }
                  className={`${
                    enabled.tokenGate ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      enabled.tokenGate ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add Token contract addresses to gate{" "}
              </div>
            </div>
            <div className={`${!enabled.tokenGate && "hidden"} ml-4 mr-4 `}>
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

            <Button color="teal" className="m-4"> Mint </Button>
          </>
        }
      />
    </>
  );
};

export default SolanaMint;
