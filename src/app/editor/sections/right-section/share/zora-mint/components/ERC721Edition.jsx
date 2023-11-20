import React, { useContext, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../../common";
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
import { Context } from "../../../../../../../providers/context";

const ERC721Edition = () => {
  const {
    zoraErc721Enabled,
    setZoraErc721Enabled,
    zoraErc721StatesError,
    setZoraErc721StatesError,
  } = useContext(Context);
  return (
    <>
      {/* Switch Number 1 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Collection Details </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set a Name and Symbol for the collection{" "}
        </div>
      </div>

      <div className={` ml-4 mr-4`}>
        <div className="flex flex-col w-full py-2">
          {/* <label htmlFor="price">Collect limit</label> */}
          <InputBox
            label="Collection Name"
            name="contractName"
            value={zoraErc721Enabled.contractName}
          />
          <div className="mt-2">
            <InputBox
              label="Collection Symbol"
              name="contractSymbol"
              value={zoraErc721Enabled.contractSymbol}
            />
          </div>
          {zoraErc721StatesError.isSellerFeeError && (
            <InputErrorMsg
              message={zoraErc721StatesError.sellerFeeErrorMessage}
            />
          )}
        </div>
      </div>

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Mint Price</h2>
          <Switch
            checked={zoraErc721Enabled.isChargeForMint}
            onChange={() =>
              setZoraErc721Enabled({
                ...zoraErc721Enabled,
                isChargeForMint: !zoraErc721Enabled.isChargeForMint,
              })
            }
            className={`${
              zoraErc721Enabled.isChargeForMint ? "bg-[#00bcd4]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
          >
            <span
              className={`${
                zoraErc721Enabled.isChargeForMint
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set an amount to be charged for minting{" "}
        </div>
      </div>

      <div className={`${!zoraErc721Enabled.isChargeForMint && "hidden"} mx-4`}>
        <div className="flex">
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"0.01"}
              label="Price"
              name="chargeForMintPriceZora"
              value={zoraErc721Enabled.chargeForMintPrice}
            />
          </div>

          <div className="flex flex-col py-2 mx-2">
            {/* <label htmlFor="price"></label> */}
            <Select
              label="Currency"
              name="chargeForMintCurrencyZora"
              id="chargeForMintCurrency"
              // className=" ml-4 p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
              value={zoraErc721Enabled.chargeForMintCurrency}
            >
              <Option>ETH</Option>
            </Select>
          </div>
        </div>

        {zoraErc721StatesError.isChargeForMintError && (
          <InputErrorMsg
            message={zoraErc721StatesError.chargeForMintErrorMessage}
          />
        )}
      </div>

      {/* Switch Number 1 End */}

      {/* Splits Switch Start */}

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Split Pecipients </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Split revenue between multiple recipients{" "}
        </div>
      </div>

      <div className={`${!zoraErc721Enabled.isRoyaltySplits && "hidden"}`}>
        <div className="mx-4">
          {zoraErc721Enabled.royaltySplitRecipients.map((recipient, index) => {
            return (
              <>
                <div
                  key={index}
                  className="flex justify-between gap-2 items-center w-full py-2"
                >
                  {/* <div className="flex justify-between items-center w-1/3"> */}
                  <InputBox
                    className="w-full"
                    label="Wallet Address"
                    value={recipient.address}
                    // onChange={(e) =>
                    //   restrictRecipientInput(e, index, recipient.address)
                    // }
                  />
                  {/* </div> */}
                  <div className="flex justify-between items-center w-1/3">
                    <NumberInputBox
                      className="w-4"
                      min={0}
                      max={100}
                      step={0.01}
                      label="%"
                      value={recipient.share}
                      // onChange={(e) => {
                      //   handleRecipientChange(
                      //     index,
                      //     "share",
                      //     Number(parseFloat(e.target.value).toFixed(2))
                      //   );
                      // }}
                    />
                    {/* {!restrictRemoveRecipientInputBox(
                      index,
                      recipient.address
                    ) && (
                      <XCircleIcon
                        className="h-6 w-6 cursor-pointer"
                        color="red"
                        onClick={() => removeRecipientInputBox(index)}
                      />
                    )} */}
                  </div>
                </div>
              </>
            );
          })}

          {zoraErc721StatesError.isRoyaltySplitError && (
            <InputErrorMsg
              message={zoraErc721StatesError.royaltySplitErrorMessage}
            />
          )}

          <Button
            color="cyan"
            size="sm"
            variant="filled"
            className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          >
            <BsPlus />
            Add Recipient
          </Button>
        </div>
      </div>
      {/* Splits Switch End */}

      {/* Switch Number 2 Start */}

      {/* Switch Number 2 End */}

      {/* Switch Number 3 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Limit mints per address </h2>
          <Switch
            checked={zoraErc721Enabled.isMintLimitPerAddress}
            onChange={() =>
              setZoraErc721Enabled({
                ...zoraErc721Enabled,
                isMintLimitPerAddress: !zoraErc721Enabled.isMintLimitPerAddress,
              })
            }
            className={`${
              zoraErc721Enabled.isMintLimitPerAddress
                ? "bg-[#00bcd4]"
                : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
          >
            <span
              className={`${
                zoraErc721Enabled.isMintLimitPerAddress
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Limit the number of mints per address{" "}
        </div>
      </div>

      <div
        className={`${
          !zoraErc721Enabled.isMintLimitPerAddress && "hidden"
        } ml-4 mr-4`}
      >
        <div className="flex flex-col w-full py-2">
          <NumberInputBox
            min={"1"}
            step={"1"}
            label="Mint limit"
            name="mintLimitPerAddress"
            value={zoraErc721Enabled.mintLimitPerAddress}
          />
          {zoraErc721StatesError.isMintLimitPerAddressError && (
            <InputErrorMsg
              message={zoraErc721StatesError.limitedEditionErrorMessage}
            />
          )}
        </div>
      </div>
      {/* Switch Number 3 End */}

      {/* Switch Number 5 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Royalty </h2>
            <Switch
              checked={zoraErc721Enabled.isRoyaltyPercent}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isRoyaltyPercent: !zoraErc721Enabled.isRoyaltyPercent,
                })
              }
              className={`${
                zoraErc721Enabled.isRoyaltyPercent
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isRoyaltyPercent
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set Royalty percentage for minting{" "}
          </div>
        </div>

        <div
          className={`${!zoraErc721Enabled.isRoyaltyPercent && "hidden"} mx-4`}
        >
          {/* <div className="flex"> */}
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"0.01"}
              // className={"W-3/4"}
              label="Royalty % "
              name="setRoyaltyPercentZora"
              value={zoraErc721Enabled.royaltyPercent}
            />
          </div>
          {/* </div> */}

          {zoraErc721StatesError.isRoyaltyPercentError && (
            <InputErrorMsg
              message={zoraErc721StatesError.royaltyPercentErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 5 End */}

      {/* Switch Number 6 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Supply </h2>
            <Switch
              checked={zoraErc721Enabled.isMaxSupply}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isMaxSupply: !zoraErc721Enabled.isMaxSupply,
                })
              }
              className={`${
                zoraErc721Enabled.isMaxSupply ? "bg-[#00bcd4]" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isMaxSupply
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set the maximum supply limit for the mint{" "}
          </div>
        </div>

        <div className={`${!zoraErc721Enabled.isMaxSupply && "hidden"} mx-4`}>
          {/* <div className="flex"> */}
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"0.01"}
              // className={"W-3/4"}
              label="Max Supply "
              name="maxSupplyZora"
              value={zoraErc721Enabled.maxSupply}
            />
          </div>
          {/* </div> */}

          {zoraErc721StatesError.isMaxSupplyError && (
            <InputErrorMsg
              message={zoraErc721StatesError.maxSupplyErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 6 End */}

      {/* Switch Number 4 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Allowlist </h2>
          <Switch
            checked={zoraErc721Enabled.isAllowlist}
            onChange={() =>
              setZoraErc721Enabled({
                ...zoraErc721Enabled,
                isAllowlist: !zoraErc721Enabled.isAllowlist,
              })
            }
            className={`${
              zoraErc721Enabled.isAllowlist ? "bg-[#00bcd4]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
          >
            <span
              className={`${
                zoraErc721Enabled.isAllowlist ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Allow specific wallet addresses to mint{" "}
        </div>
      </div>

      <div className={`ml-4 mr-4 ${!zoraErc721Enabled.isAllowlist && "hidden"} `}>
        {zoraErc721Enabled.allowlistAddresses.map((recipient, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <InputBox
                  label="Wallet Address"
                  value={recipient}
                  // onChange={(e) =>
                  //   handleArrlistChange(
                  //     index,
                  //     e.target.value,
                  //     "allowlistAddresses"
                  //   )
                  // }
                />

                <div className="flex justify-between items-center">
                  {index != 0 && (
                    <TiDelete
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      // onClick={() =>
                      //   removeArrlistInputBox(index, "allowlistAddresses")
                      // }
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}
        {zoraErc721StatesError.isAllowlistError && (
          <InputErrorMsg message={zoraErc721StatesError.allowlistErrorMessage} />
        )}
        <Button
          color="cyan"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          // onClick={() => addArrlistInputBox("allowlistAddresses")}
        >
          <BsPlus />
          Add Recipient
        </Button>

        <div className="text-center mt-2"> OR </div>

        <Button
          color="cyan"
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

      {/* Switch Number 7 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Pre - Sale Schedule </h2>
            <Switch
              checked={zoraErc721Enabled.isPresaleSchedule}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isPresaleSchedule: !zoraErc721Enabled.isPresaleSchedule,
                })
              }
              className={`${
                zoraErc721Enabled.isPresaleSchedule
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isPresaleSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set a start and end date for your Presale schedule of the mint{" "}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            !zoraErc721Enabled.isPresaleSchedule && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <div>Start</div> <DateTimePicker />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div> <DateTimePicker />
          </div>

          {zoraErc721StatesError.isPresaleScheduleError && (
            <InputErrorMsg
              message={zoraErc721StatesError.presaleScheduleErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 7 End */}

      {/* Switch Number 8 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Public - Sale Schedule </h2>
            <Switch
              checked={zoraErc721Enabled.isPublicsaleSchedule}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isPublicsaleSchedule: !zoraErc721Enabled.isPublicsaleSchedule,
                })
              }
              className={`${
                zoraErc721Enabled.isPublicsaleSchedule
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isPublicsaleSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set a start and end date for your Public sale schedule of the mint{" "}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            !zoraErc721Enabled.isPublicsaleSchedule && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <div>Start</div> <DateTimePicker />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div> <DateTimePicker />
          </div>

          {zoraErc721StatesError.isPublicsaleScheduleError && (
            <InputErrorMsg
              message={zoraErc721StatesError.publicsaleScheduleErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 8 End */}

      <div className="mx-2 my-4">
        <Button fullWidth color="cyan">
          {" "}
          Mint{" "}
        </Button>
      </div>
    </>
  );
};

export default ERC721Edition;
