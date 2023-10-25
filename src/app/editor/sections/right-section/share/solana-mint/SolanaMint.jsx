import React, { useState } from "react";
import { SharePanelHeaders } from "../components";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../common";
import { SwitchGroup } from "../components";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { Button, Option, Select } from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import { useContext } from "react";
import { useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Context } from "../../../../../../providers/context";
import { LOCAL_STORAGE } from "../../../../../../data";
import { SolanaWallets } from "../../../top-section/auth/wallets";
import { errorMessage, getFromLocalStorage } from "../../../../../../utils";
import { toast } from "react-toastify";
import { shareOnSocials } from "../../../../../../services";
import { useMutation } from "@tanstack/react-query";
import TiDelete from "@meronex/icons/ti/TiDelete";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useSolanaWallet } from "../../../../../../hooks/solana";
import { useAppAuth, useReset } from "../../../../../../hooks/app";

const SolanaMint = () => {
  const { solanaAddress } = useSolanaWallet();
  const [sharing, setSharing] = useState(false);
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const { isAuthenticated } = useAppAuth();

  const {
    solanaEnabled,
    setSolanaEnabled,
    postDescription,
    setPostDescription,
    contextCanvasIdRef,
    parentRecipientListRef,
    setMenu,
    setIsShareOpen,
    setDialogOpen,
    setExplorerLink,

    priceError,
    setPriceError,
    splitError,
    setSplitError,
    editionError,
    setEditionError,
    referralError,
    setReferralError,
  } = useContext(Context);
  const { resetState } = useReset();

  const { mutateAsync: shareOnSolana } = useMutation({
    mutationKey: "shareOnSolana",
    mutationFn: shareOnSocials,
  });

  let creatorAdd = true;

  const mintSettings = () => {
    // TODO: check if here needs to be any checks
    // if (
    //   !solanaEnabled.chargeForMint &&
    //   !solanaEnabled.onChainSplits &&
    //   !solanaEnabled.limitNoOfEditions &&
    //   !solanaEnabled.scheduleMint &&
    //   !solanaEnabled.allowlist &&
    //   !solanaEnabled.nftBurn &&
    //   !solanaEnabled.nftGate &&
    //   !solanaEnabled.tokenGate
    // ) {
    //   return false;
    // }

    let canvasParams = {};

    if (creatorAdd) {
      canvasParams = {
        ...canvasParams,
        creators: solanaEnabled.onChainSplitRecipients,
      };
    }

    return canvasParams;
  };

  const sharePost = (platform) => {
    // TODO:  enables some checks here

    // check if canvasId is provided
    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }
    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    setSharing(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "solana post",
      content: postDescription,
    };

    const id = toast.loading(`Sharing on ${platform}...`);
    shareOnSolana({
      canvasData: canvasData,
      canvasParams: mintSettings(),
      platform: platform,
      // timeStamp: formatDateTimeUnix(stFormattedDate, stFormattedTime),
    })
      .then((res) => {
        if (res?.status === 200) {
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti({
            emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
            confettiNumber: 100,
          });

          toast.update(id, {
            render: `Shared on ${platform}`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          // open explorer link
          setExplorerLink(res?.assetId);
          setDialogOpen(true);

          // TODO: clear all the states and variables
          resetState();
        } else {
          toast.update(id, {
            render: `Error sharing on ${platform}`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setSharing(false);
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: errorMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setSharing(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "chargeForMintPrice") {
      if (value < 0.1) {
        setPriceError({
          isError: true,
          message: "Price should be minimum 0.1",
        });
      } else {
        setPriceError({
          isError: false,
          message: "",
        });
      }
    } else if (name === "limitedEditionNumber") {
      if (value < 1) {
        setEditionError({
          isError: true,
          message: "Collect limit should be minimum 1",
        });
      } else {
        setEditionError({
          isError: false,
          message: "",
        });
      }
    } else if (name === "mirrorReferralRewardFee") {
      if (value < 1) {
        setReferralError({
          isError: true,
          message: "Referral fee should be between 1% to 100%",
        });
      } else {
        setReferralError({
          isError: false,
          message: "",
        });
      }
    }

    if (name === "mirrorReferralRewardFee") {
      setSolanaEnabled((prevEnabled) => ({
        ...prevEnabled,
        [name]: Number(parseFloat(value).toFixed(2)),
      }));
    } else {
      setSolanaEnabled((prevEnabled) => ({ ...prevEnabled, [name]: value }));
    }
  };

  // funtions adding removing data
  const handleRecipientChange = (index, key, value) => {
    const updatedRecipients = [...solanaEnabled.onChainSplitRecipients];
    updatedRecipients[index][key] = value;
    setSolanaEnabled((prevEnabled) => ({
      ...prevEnabled,
      onChainSplitRecipients: updatedRecipients,
    }));
  };

  // funtions for adding new input box for split revenue
  const addRecipientInputBox = () => {
    setSolanaEnabled({
      ...solanaEnabled,
      onChainSplitRecipients: [
        ...solanaEnabled.onChainSplitRecipients,
        {
          recipient: "",
          split: 1.0,
        },
      ],
    });
  };

  // funtions for removing input box
  const removeRecipientInputBox = (index) => {
    const updatedRecipients = solanaEnabled.onChainSplitRecipients.filter(
      (_, i) => i !== index
    );

    setSolanaEnabled({
      ...solanaEnabled,
      onChainSplitRecipients: updatedRecipients,
    });

    setSplitError({
      isError: false,
      message: "",
    });
  };

  // Calendar Functions:
  const onCalChange = (value, dateString) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    setSolanaEnabled({
      ...solanaEnabled,
      startTimeStamp: {
        date: dateTime.toLocaleDateString(undefined, dateOptions),
        time: dateTime.toLocaleTimeString(undefined, timeOptions),
      },
      endTimestamp: {
        date: dateTime.toLocaleDateString(undefined, dateOptions),
        time: dateTime.toLocaleTimeString(undefined, timeOptions),
      },
    });
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated && parentRecipientListRef.current.length > 0) {
      const updatedRecipients = parentRecipientListRef.current
        .slice(1)
        .map((item) => ({
          address: item,
          share: 1.0,
        }));

      setSolanaEnabled((prevEnabled) => ({
        ...prevEnabled,
        onChainSplitRecipients: [...updatedRecipients],
      }));
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   const isRecipients = solanaEnabled.onChainSplitRecipients.length > 0;

  //   if (isRecipients) {
  //     setSolanaEnabled({
  //       ...solanaEnabled,
  //       isOnChainSplits: true,
  //     });
  //   }
  // }, [solanaEnabled.onChainSplitRecipients]);

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
                  checked={solanaEnabled.isChargeForMint}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isChargeForMint: !solanaEnabled.isChargeForMint,
                    })
                  }
                  className={`${
                    solanaEnabled.isChargeForMint
                      ? "bg-[#008080]"
                      : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isChargeForMint
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
            <div
              className={`${
                !solanaEnabled.isChargeForMint && "hidden"
              } ml-4 mr-4 flex`}
            >
              <NumberInputBox
                min={"1"}
                step={"0.01"}
                className={"W-3/4"}
                placeholder="1"
                name="chargeForMintPrice"
                value={solanaEnabled.chargeForMintPrice}
                onChange={(e) => handleChange(e)}
              />

              <div className="flex flex-col w-1/4">
                {/* <label htmlFor="price"></label> */}
                <Select
                  label="Currency"
                  name="chargeForMintCurrency"
                  id="chargeForMintCurrency"
                  className=" ml-4 p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleChange}
                  value={solanaEnabled.chargeForMintCurrency}
                >
                  <Option>SOL</Option>
                  <Option>ETH</Option>
                </Select>
              </div>
              {priceError.isError && (
                <InputErrorMsg message={priceError.message} />
              )}
            </div>

            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> On Chain Splits </h2>
                <Switch
                  checked={solanaEnabled.isOnChainSplits}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isOnChainSplits: !solanaEnabled.isOnChainSplits,
                    })
                  }
                  className={`${
                    solanaEnabled.isOnChainSplits
                      ? "bg-[#008080]"
                      : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isOnChainSplits
                        ? "translate-x-6"
                        : "translate-x-1"
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
            <div className={`${!solanaEnabled.isOnChainSplits && "hidden"}`}>
              <div className="mx-4">
                {solanaEnabled.onChainSplitRecipients.map(
                  (recipient, index) => {
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
                            onChange={(e) =>
                              handleRecipientChange(
                                index,
                                "address",
                                e.target.value
                              )
                            }
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
                              onChange={(e) => {
                                handleRecipientChange(
                                  index,
                                  "share",
                                  Number(parseFloat(e.target.value).toFixed(2))
                                );
                              }}
                            />
                            <XCircleIcon
                              className="h-6 w-6 cursor-pointer"
                              color="red"
                              onClick={() => removeRecipientInputBox(index)}
                            />
                            {/* )} */}
                          </div>
                        </div>
                      </>
                    );
                  }
                )}

                <Button
                  color="teal"
                  size="sm"
                  variant="filled"
                  className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                  onClick={addRecipientInputBox}
                >
                  <BsPlus />
                  Add Recipient
                </Button>
              </div>
            </div>
            {/* )} */}
            {/* Switch Number 2 End */}
            {/* Working End */}

            {/* Switch Number 3 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Limit number of editions </h2>
                <Switch
                  checked={solanaEnabled.isLimitedEdition}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isLimitedEdition: !solanaEnabled.isLimitedEdition,
                    })
                  }
                  className={`${
                    solanaEnabled.isLimitedEdition
                      ? "bg-[#008080]"
                      : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isLimitedEdition
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
              className={`${
                !solanaEnabled.isLimitedEdition && "hidden"
              } ml-4 mr-4`}
            >
              <div className="flex flex-col w-full py-2">
                <label htmlFor="price">Collect limit</label>
                <NumberInputBox
                  min={"1"}
                  step={"1"}
                  placeholder="1"
                  name="limitedEditionNumber"
                  onChange={(e) => handleChange(e)}
                  value={solanaEnabled.limitedEditionNumber}
                />
                {editionError.isError && (
                  <InputErrorMsg message={editionError.message} />
                )}
              </div>
            </div>
            {/* Switch Number 3 End */}

            {/* Switch Number 4 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Schedule your Mint </h2>
                <Switch
                  checked={solanaEnabled.isTimeLimit}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isTimeLimit: !solanaEnabled.isTimeLimit,
                    })
                  }
                  className={`${
                    solanaEnabled.isTimeLimit ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isTimeLimit
                        ? "translate-x-6"
                        : "translate-x-1"
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
              className={`flex flex-col ${
                !solanaEnabled.isTimeLimit && "hidden"
              } `}
            >
              <div className="ml-4 mr-4 flex justify-between text-center align-middle">
                <div>Start</div> <DateTimePicker onChange={onCalChange} />
              </div>
              <div className="m-4 flex justify-between text-center align-middle">
                <div>End</div> <DateTimePicker onChange={onCalChange} />
              </div>
            </div>

            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Allowlist </h2>
                <Switch
                  checked={solanaEnabled.isAllowlist}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isAllowlist: !solanaEnabled.isAllowlist,
                    })
                  }
                  className={`${
                    solanaEnabled.isAllowlist ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isAllowlist
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Allow specific contract addresses to mint{" "}
              </div>
            </div>

            <div
              className={`ml-4 mr-4 ${!solanaEnabled.isAllowlist && "hidden"} `}
            >
              {solanaEnabled.allowlistAddresses.map((recipient, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="flex justify-between gap-2 items-center w-full py-2"
                    >
                      <InputBox
                        placeholder="ERC20 Address"
                        value={recipient}
                        onChange={(e) =>
                          // restrictRecipientInput(e, index, recipient)
                          console.log(e.target.value)
                        }
                      />
                      <div className="flex justify-between items-center w-1/3">
                        {/* {!restrictremoveRecipientInputBox(
                              index,
                              recipient
                            ) && ( */}
                        <TiDelete
                          className="h-6 w-6 cursor-pointer"
                          color="red"
                          // onClick={() => removeRecipientInputBox(index)}
                        />
                        {/* )} */}
                      </div>
                    </div>
                  </>
                );
              })}
              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                onClick={() => {}}
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
                  checked={solanaEnabled.isNftBurnable}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isNftBurnable: !solanaEnabled.isNftBurnable,
                    })
                  }
                  className={`${
                    solanaEnabled.isNftBurnable ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isNftBurnable
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add NFT Contract Addresses{" "}
              </div>
            </div>
            <div
              className={`${
                !solanaEnabled.isNftBurnable && "hidden"
              } ml-4 mr-4 `}
            >
              {solanaEnabled.nftBurnableContractAddresses.map(
                (recipient, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="flex justify-between gap-2 items-center w-full py-2"
                      >
                        <InputBox
                          placeholder="ERC20 Address"
                          value={recipient}
                          onChange={(e) =>
                            // restrictRecipientInput(e, index, recipient)
                            console.log(e.target.value)
                          }
                        />
                        <div className="flex justify-between items-center w-1/3">
                          {/* {!restrictremoveRecipientInputBox(
                              index,
                              recipient
                            ) && ( */}
                          <TiDelete
                            className="h-6 w-6 cursor-pointer"
                            color="red"
                            // onClick={() => removeRecipientInputBox(index)}
                          />
                          {/* )} */}
                        </div>
                      </div>
                    </>
                  );
                }
              )}
              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                onClick={() => {}}
              >
                <BsPlus />
                Add Recipient
              </Button>
            </div>
            {/* Switch Number 5 End */}

            {/* Switch Number 6 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> NFT Gate </h2>
                <Switch
                  checked={solanaEnabled.isNftGate}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isNftGate: !solanaEnabled.isNftGate,
                    })
                  }
                  className={`${
                    solanaEnabled.isNftGate ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isNftGate
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add NFT contract addresses to gate{" "}
              </div>
            </div>
            <div
              className={`${!solanaEnabled.isNftGate && "hidden"} ml-4 mr-4 `}
            >
              {solanaEnabled.nftGateContractAddresses.map(
                (recipient, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="flex justify-between gap-2 items-center w-full py-2"
                      >
                        <InputBox
                          placeholder="ERC20 Address"
                          value={recipient}
                          onChange={(e) =>
                            // restrictRecipientInput(e, index, recipient)
                            console.log(e.target.value)
                          }
                        />
                        <div className="flex justify-between items-center w-1/3">
                          {/* {!restrictremoveRecipientInputBox(
                              index,
                              recipient
                            ) && ( */}
                          <TiDelete
                            className="h-6 w-6 cursor-pointer"
                            color="red"
                            // onClick={() => removeRecipientInputBox(index)}
                          />
                          {/* )} */}
                        </div>
                      </div>
                    </>
                  );
                }
              )}
              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                onClick={() => {}}
              >
                <BsPlus />
                Add Recipient
              </Button>
            </div>
            {/* Switch Number 6 End */}

            {/* Switch Number 7 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Token Gate </h2>
                <Switch
                  checked={solanaEnabled.isTokenGate}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      isTokenGate: !solanaEnabled.isTokenGate,
                    })
                  }
                  className={`${
                    solanaEnabled.isTokenGate ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.isTokenGate
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add Token contract addresses to gate{" "}
              </div>
            </div>
            <div
              className={`${!solanaEnabled.isTokenGate && "hidden"} ml-4 mr-4 `}
            >
              {solanaEnabled.tokenGateContractAddresses.map(
                (recipient, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="flex justify-between gap-2 items-center w-full py-2"
                      >
                        <InputBox
                          placeholder="ERC20 Address"
                          value={recipient}
                          onChange={(e) =>
                            // restrictRecipientInput(e, index, recipient)
                            console.log(e.target.value)
                          }
                        />
                        <div className="flex justify-between items-center w-1/3">
                          {/* {!restrictremoveRecipientInputBox(
                              index,
                              recipient
                            ) && ( */}
                          <TiDelete
                            className="h-6 w-6 cursor-pointer"
                            color="red"
                            // onClick={() => removeRecipientInputBox(index)}
                          />
                          {/* )} */}
                        </div>
                      </div>
                    </>
                  );
                }
              )}
              <Button
                color="teal"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                onClick={() => {}}
              >
                <BsPlus />
                Add Recipient
              </Button>
            </div>
            {/* Switch Number 7 End */}
            {getSolanaAuth ? (
              <Button
                disabled={sharing}
                onClick={() => sharePost("solana-cnft")}
                color="teal"
                className="mx-4"
              >
                {" "}
                Mint{" "}
              </Button>
            ) : (
              <SolanaWallets title="Login with Solana" className="mx-2" />
            )}
          </>
        }
      />
    </>
  );
};

export default SolanaMint;
