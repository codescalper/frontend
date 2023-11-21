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
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useAppAuth } from "../../../../../../../hooks/app";
import { APP_ETH_ADDRESS } from "../../../../../../../data";

const ERC721Edition = () => {
  const { address } = useAccount();
  const { isAuthenticated } = useAppAuth();
  const {
    zoraErc721Enabled,
    setZoraErc721Enabled,
    zoraErc721StatesError,
    setZoraErc721StatesError,
    contextCanvasIdRef,
    postDescription,
    parentRecipientListRef,
  } = useContext(Context);

  // formate date and time in ISO 8601 format for monatizationn settings
  const formatDateTimeISO8601 = (date, time) => {
    if (!date || !time) return;
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.toISOString();
  };

  // Calendar Functions:
  const onCalChange = (value, key) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    if (key.startsWith("pre")) {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: {
          date: dateTime.toLocaleDateString(undefined, dateOptions),
          time: dateTime.toLocaleTimeString(undefined, timeOptions),
        },
      });
    } else if (key.startsWith("pub")) {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: {
          date: dateTime.toLocaleDateString(undefined, dateOptions),
          time: dateTime.toLocaleTimeString(undefined, timeOptions),
        },
      });
    }
  };

  // funtion to add new input box for multi addresses
  const addArrlistInputBox = (key) => {
    if (key === "royaltySplitRecipients") {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: [
          ...zoraErc721Enabled[key],
          { address: "", percentAllocation: "" },
        ],
      });
      return;
    }

    setZoraErc721Enabled({
      ...zoraErc721Enabled,
      [key]: [...zoraErc721Enabled[key], ""],
    });
  };

  // funtion to remove input box for multi addresses
  const removeArrlistInputBox = (index, key, isErrKey, errKeyMsg) => {
    setZoraErc721Enabled({
      ...zoraErc721Enabled,
      [key]: zoraErc721Enabled[key].filter((_, i) => i !== index),
    });

    if (isErrKey) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        [isErrKey]: false,
        [errKeyMsg]: "",
      });
    }
  };

  // funtion adding data for split revenues recipients
  const handleRecipientChange = (index, key, value) => {
    // check index 0 price should min 10
    if (key === "percentAllocation" && index === 0) {
      if (value < 10 || value > 100 || isNaN(value)) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage:
            "Platform fee should be between 10% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }

    // any index price should be greater min 1 and max 100
    if (key === "percentAllocation" && index !== 0) {
      if (value < 1 || value > 100 || isNaN(value)) {
        setZoraErc721StatesError({
          zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage: "Split should be between 1% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }

    // check if the address is not same

    const updatedRecipients = [...zoraErc721Enabled.royaltySplitRecipients];
    updatedRecipients[index][key] = value;
    setZoraErc721Enabled((prevEnabled) => ({
      ...prevEnabled,
      royaltySplitRecipients: updatedRecipients,
    }));
  };

  // restrict the input box if the recipient is in the parent list
  const restrictRecipientInput = (e, index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    const isUserAddress = recipient === address;
    if (index === 0 || isRecipient) {
      if (isUserAddress) {
        handleRecipientChange(index, "address", e.target.value);
      }
    } else {
      handleRecipientChange(index, "address", e.target.value);
    }
  };

  // restrict the delete button if recipient is in the parent list
  const restrictRemoveRecipientInputBox = (index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    if (index === 0 || isRecipient) {
      return true;
    }
  };

  // handle for input fields
  const handleChange = (e, index, key) => {
    const { name, value } = e.target;

    // check if collection name and symbol are provided
    if (name === "contractName") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractNameError: true,
          contractNameErrorMessage: "Collection Name is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractNameError: false,
          contractNameErrorMessage: "",
        });
      }
    } else if (name === "contractSymbol") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractSymbolError: true,
          contractSymbolErrorMessage: "Collection Symbol is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractSymbolError: false,
          contractSymbolErrorMessage: "",
        });
      }
    }

    // check if price is provided
    if (name === "chargeForMintPrice") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price is required",
        });
      } else if (value < 0.001) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price must be greater than 0.001",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: false,
          chargeForMintErrorMessage: "",
        });
      }
    }

    // check if mint limit is provided
    if (name === "mintLimitPerAddress") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMintLimitPerAddressError: true,
          limitedEditionErrorMessage: "Mint limit is required",
        });
      } else if (value < 1) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMintLimitPerAddressError: true,
          limitedEditionErrorMessage: "Mint limit must be greater than 0",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMintLimitPerAddressError: false,
          limitedEditionErrorMessage: "",
        });
      }
    }

    // check if royalty percent is provided
    if (name === "royaltyPercent") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty percent is required",
        });
      } else if (value < 1 || value > 100) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty must be between 1% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltyPercentError: false,
          royaltyPercentErrorMessage: "",
        });
      }
    }

    // check if max supply is provided
    if (name === "maxSupply") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMaxSupplyError: true,
          maxSupplyErrorMessage: "Max supply is required",
        });
      } else if (value < 1) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMaxSupplyError: true,
          maxSupplyErrorMessage: "Max supply must be greater than 0",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMaxSupplyError: false,
          maxSupplyErrorMessage: "",
        });
      }
    }

    // check if allowlist is provided
    if (name === "allowlistAddresses") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isAllowlistError: true,
          allowlistErrorMessage: "Allowlist address is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isAllowlistError: false,
          allowlistErrorMessage: "",
        });
      }
    }

    // add data
    if (name === "allowlistAddresses") {
      setZoraErc721Enabled((prevEnabled) => ({
        ...prevEnabled,
        [name]: prevEnabled[name].map((item, i) =>
          i === index ? value : item
        ),
      }));
    } else {
      setZoraErc721Enabled((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // mint settings
  const handleMintSettings = () => {
    let arr = [];

    return { args: arr };
  };

  // mint on Zora
  const handleSubmit = () => {
    // TODO:  enables some checks here

    // check if canvasId is provided
    // if (contextCanvasIdRef.current === null) {
    //   toast.error("Please select a design");
    //   return;
    // }

    // // check if description is provided
    // if (!postDescription) {
    //   toast.error("Please provide a description");
    //   return;
    // }

    // check if collection name is provided
    if (!zoraErc721Enabled.contractName) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isContractNameError: true,
        contractNameErrorMessage: "Collection Name is required",
      });
      return;
    }

    // check if collection symbol is provided
    if (!zoraErc721Enabled.contractSymbol) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isContractSymbolError: true,
        contractSymbolErrorMessage: "Collection Symbol is required",
      });
      return;
    }

    // check if price is provided
    if (zoraErc721Enabled.isChargeForMint) {
      if (!zoraErc721Enabled.chargeForMintPrice) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price is required",
        });
        return;
      } else if (zoraErc721StatesError.isChargeForMintError) return;
    }
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated) {
      const updatedRecipients = parentRecipientListRef.current.map((item) => ({
        address: item,
        percentAllocation: 1.0,
      }));

      setZoraErc721Enabled((prevEnabled) => ({
        ...prevEnabled,
        royaltySplitRecipients: [
          {
            address: APP_ETH_ADDRESS,
            percentAllocation:
              zoraErc721Enabled.royaltySplitRecipients[0].percentAllocation ||
              10.0,
          },
          ...updatedRecipients,
        ],
      }));
    }
  }, [isAuthenticated]);

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
          <InputBox
            label="Collection Name"
            name="contractName"
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
            value={zoraErc721Enabled.contractName}
          />
          {zoraErc721StatesError.isContractNameError && (
            <InputErrorMsg
              message={zoraErc721StatesError.contractNameErrorMessage}
            />
          )}
          <div className="mt-2">
            <InputBox
              label="Collection Symbol"
              name="contractSymbol"
              onChange={(e) => handleChange(e)}
              // onFocus={(e) => handleChange(e)}
              value={zoraErc721Enabled.contractSymbol}
            />
          </div>
          {zoraErc721StatesError.isContractSymbolError && (
            <InputErrorMsg
              message={zoraErc721StatesError.contractSymbolErrorMessage}
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
              min={"0.001"}
              step={"0.01"}
              label="Price"
              name="chargeForMintPrice"
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
              value={zoraErc721Enabled.chargeForMintPrice}
            />
          </div>

          <div className="flex flex-col py-2 mx-2">
            {/* <label htmlFor="price"></label> */}
            <Select
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
              label="Currency"
              name="chargeForMintCurrency"
              id="chargeForMintCurrency"
            >
              {["eth"].map((currency) => (
                <Option
                  key={currency}
                  onClick={() => {
                    setZoraErc721Enabled({
                      ...zoraErc721Enabled,
                      chargeForMintCurrency: currency,
                    });
                  }}
                >
                  {currency.toUpperCase()}
                </Option>
              ))}
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
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <div className="flex-1">
                  <InputBox
                    label="Wallet Address"
                    value={recipient.address}
                    onChange={(e) =>
                      restrictRecipientInput(e, index, recipient.address)
                    }
                  />
                </div>
                <div className="">
                  <NumberInputBox
                    min={0}
                    max={100}
                    step={0.01}
                    label="%"
                    value={recipient.percentAllocation}
                    onFocus={(e) => {
                      handleRecipientChange(
                        index,
                        "percentAllocation",
                        Number(parseFloat(e.target.value).toFixed(2))
                      );
                    }}
                    onChange={(e) => {
                      handleRecipientChange(
                        index,
                        "percentAllocation",
                        Number(parseFloat(e.target.value).toFixed(2))
                      );
                    }}
                  />
                </div>
                {!restrictRemoveRecipientInputBox(index, recipient.address) && (
                  <span>
                    <XCircleIcon
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(
                          index,
                          "royaltySplitRecipients",
                          "isRoyaltySplitError",
                          "royaltySplitErrorMessage"
                        )
                      }
                    />
                  </span>
                )}
              </div>
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
            onClick={() => addArrlistInputBox("royaltySplitRecipients")}
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
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
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
              label="Royalty % "
              name="royaltyPercent"
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
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
              name="maxSupply"
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
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
                zoraErc721Enabled.isAllowlist
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Allow specific wallet addresses to mint{" "}
        </div>
      </div>

      <div
        className={`ml-4 mr-4 ${!zoraErc721Enabled.isAllowlist && "hidden"} `}
      >
        {zoraErc721Enabled.allowlistAddresses.map((recipient, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <InputBox
                  label="Wallet Address"
                  name="allowlistAddresses"
                  value={recipient}
                  onChange={(e) => handleChange(e, index)}
                  onFocus={(e) => handleChange(e, index)}
                />

                <div className="flex justify-between items-center">
                  {index != 0 && (
                    <XCircleIcon
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(index, "allowlistAddresses")
                      }
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}
        {zoraErc721StatesError.isAllowlistError && (
          <InputErrorMsg
            message={zoraErc721StatesError.allowlistErrorMessage}
          />
        )}
        <Button
          color="cyan"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          onClick={() => addArrlistInputBox("allowlistAddresses")}
        >
          <BsPlus />
          Add Recipient
        </Button>

        <div className="text-center mt-2"> OR </div>

        <Button
          disabled={true}
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
            <div>Start</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "preSaleStartTimeStamp")}
            />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "preSaleEndTimeStamp")}
            />
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
              checked={zoraErc721Enabled.isPublicSaleSchedule}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isPublicSaleSchedule: !zoraErc721Enabled.isPublicSaleSchedule,
                })
              }
              className={`${
                zoraErc721Enabled.isPublicSaleSchedule
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isPublicSaleSchedule
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
            !zoraErc721Enabled.isPublicSaleSchedule && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <div>Start</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "publicSaleStartTimeStamp")}
            />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "publicSaleEndTimeStamp")}
            />
          </div>

          {zoraErc721StatesError.isPublicSaleScheduleError && (
            <InputErrorMsg
              message={zoraErc721StatesError.publicsaleScheduleErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 8 End */}

      <div className="mx-2 my-4">
        <Button fullWidth color="cyan" onClick={handleSubmit}>
          {" "}
          Mint{" "}
        </Button>
      </div>
    </>
  );
};

export default ERC721Edition;
