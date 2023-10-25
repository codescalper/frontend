import React, { useState } from "react";
import { SharePanelHeaders } from "../components";
import { InputBox, NumberInputBox } from "../../../../common";
import { SwitchGroup } from "../components";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { Button } from "@material-tailwind/react";
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
import { useAccount } from "wagmi";
import TiDelete from "@meronex/icons/ti/TiDelete";

const SolanaMint = () => {
  const { address, isConnected } = useAccount();
  const [sharing, setSharing] = useState(false);
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);

  const {
    parentOnChainSplitsRef,
    setSplitError,
    solanaEnabled,
    setSolanaEnabled,
    chargeForMint,
    onChainSplits,
    limitNoOfEditions,
    postDescription,
    setPostDescription,
    contextCanvasIdRef,
    parentRecipientListRef,
    setMenu,
    setIsShareOpen,
    setDialogOpen,
    setExplorerLink,
  } = useContext(Context);

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
        creators: parentRecipientListRef.current.slice(1),
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
          setSharing(false);
          setIsShareOpen(false);
          setMenu("share");
          setPostDescription("");
          setSolanaEnabled({
            chargeForMint: false,
            onChainSplits: false,
            limitNoOfEditions: false,
            scheduleMint: false,
            allowlist: false,
            nftBurn: false,
            nftGate: false,
            tokenGate: false,
          });
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
    console.log(e.target.value);
  };

  // Add an input field on Button click
  const addSolInputBox = async ({ boxName }) => {
    console.log("Clicked +");
    if (boxName === "onChainSplits") {
      if (solanaEnabled.arrOnChainSplitRecipients.length < 5) {
        setSolanaEnabled({
          ...solanaEnabled,
          arrOnChainSplitRecipients: [
            ...solanaEnabled.arrOnChainSplitRecipients,
            { recipient: "", split: 1.0 },
          ],
        });
      }
    }
    if (boxName === "allowlist") {
      if (solanaEnabled.arrAllowlist.length < 5) {
        setSolanaEnabled({
          ...solanaEnabled,
          arrAllowlist: [...solanaEnabled.arrAllowlist, { recipient: "" }],
        });
      }
    }
    if (boxName === "nftBurn") {
      if (solanaEnabled.arrNFTBurn.length < 5) {
        setSolanaEnabled({
          ...solanaEnabled,
          arrNFTBurn: [...solanaEnabled.arrNFTBurn, { recipient: "" }],
        });
      }
    }
    if (boxName === "nftGate") {
      if (solanaEnabled.arrNFTGate.length < 5) {
        setSolanaEnabled({
          ...solanaEnabled,
          arrNFTGate: [...solanaEnabled.arrNFTGate, { recipient: "" }],
        });
      }
    }
    if (boxName === "tokenGate") {
      if (solanaEnabled.arrTokenGate.length < 5) {
        setSolanaEnabled({
          ...solanaEnabled,
          arrTokenGate: [
            ...solanaEnabled.arrTokenGate,
            { recipient: "", split: 1.0 },
          ],
        });
      }
    }
  };

  // Add recipient to the split list
  // useEffect(() => {
  //   if (isConnected) {
  //     const updatedRecipients = parentOnChainSplitsRef.current
  //       .slice(0, 4)
  //       .map((item) => ({
  //         recipient: item,
  //         split: 1.0,
  //       }));

  //     setSolanaEnabled((prevEnabled) => ({
  //       ...prevEnabled,
  //       arrOnChainSplitRecipients: [
  //         {
  //           recipient:
  //             ENVIRONMENT === "production"
  //               ? "@lenspostxyz.lens"
  //               : "@lenspostxyz.test",
  //           split: solanaEnabled.arrOnChainSplitRecipients[0]?.split || 10.0,
  //         },
  //         ...updatedRecipients,
  //       ],
  //     }));
  //   }
  // }, [address]);

  // const restrictRecipientInput = (e, index, recipient) => {
  //   const isText = parentOnChainSplitsRef?.current.includes(
  //     recipient.recipient
  //   );
  //   const isUserAddress = recipient.recipient === address;
  //   if (index === 0 || isText) {
  //     if (isUserAddress) {
  //       handleRecipientChange(index, "recipient", e.target.value);
  //     }
  //   } else {
  //     handleRecipientChange(index, "recipient", e.target.value);
  //   }
  // };

  // const restrictremoveRecipientInputBox = (index, recipient) => {
  //   const istext = parentOnChainSplitsRef?.current.includes(
  //     recipient.recipient
  //   );
  //   if (index === 0 || istext) {
  //     return true;
  //   }
  // };

  // function to handle recipient field change
  // const handleRecipientChange = (index, field, value) => {
  //   // check index 0 price should min 10
  //   if (field === "split" && index === 0) {
  //     if (value < 10 || value > 100 || isNaN(value)) {
  //       setSplitError({
  //         isError: true,
  //         message: "Platform fee should be between 10% to 100%",
  //       });
  //     } else {
  //       setSplitError({
  //         isError: false,
  //         message: "",
  //       });
  //     }
  //   }

  //   // any index price should be greater min 1 and max 100
  //   if (field === "split" && index !== 0) {
  //     if (value < 1 || value > 100 || isNaN(value)) {
  //       setSplitError({
  //         isError: true,
  //         message: "Split should be between 1% to 100%",
  //       });
  //     } else {
  //       setSplitError({
  //         isError: false,
  //         message: "",
  //       });
  //     }
  //   }

  //   // check if the address is not same
  //   if (field === "recipient") {
  //     // check if the address is valid
  //     if (value.startsWith("0x") && !isEthAddress(value)) {
  //       setSplitError({
  //         isError: true,
  //         message: "Invalid recipient address",
  //       });
  //       // check if the handle is valid
  //     } else if (value.startsWith("@") && !isLensHandle(value)) {
  //       setSplitError({
  //         isError: true,
  //         message: "Invalid recipient handle",
  //       });
  //       // check if  its a random text
  //     } else if (!value.startsWith("0x") && !value.startsWith("@")) {
  //       setSplitError({
  //         isError: true,
  //         message: "Invalid recipient value",
  //       });
  //     } else {
  //       setSplitError({
  //         isError: false,
  //         message: "",
  //       });
  //     }
  //   }

  //   const updatedRecipients = [...solanaEnabled.arrOnChainSplitRecipients];
  //   updatedRecipients[index][field] = value;
  //   setSolanaEnabled({
  //     ...solanaEnabled,
  //     arrOnChainSplitRecipients: updatedRecipients,
  //   });
  // };

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
                  checked={solanaEnabled.chargeForMint}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      chargeForMint: !solanaEnabled.chargeForMint,
                    })
                  }
                  className={`${
                    solanaEnabled.chargeForMint ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.chargeForMint
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
                !solanaEnabled.chargeForMint && "hidden"
              } ml-4 mr-4 flex`}
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
                  checked={solanaEnabled.onChainSplits}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      onChainSplits: !solanaEnabled.onChainSplits,
                    })
                  }
                  className={`${
                    solanaEnabled.onChainSplits ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.onChainSplits
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
            <div className={`${!solanaEnabled.onChainSplits && "hidden"}`}>
              <div className="ml-4 mr-4">
                {/* <div className="w-3/4">
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
                </div> */}

                {solanaEnabled.arrOnChainSplitRecipients.map(
                  (recipient, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className="flex justify-between gap-2 items-center w-full py-2"
                        >
                          <div className="flex justify-between items-center w-1/3">
                            <InputBox
                              placeholder="ERC20 Address"
                              value={recipient.recipient}
                              onChange={(e) =>
                                // restrictRecipientInput(e, index, recipient)
                                console.log(e.target.value)
                              }
                            />
                          </div>
                          <div className="flex justify-between items-center w-1/3">
                            <NumberInputBox
                              min={0}
                              max={100}
                              step={0.01}
                              placeholder="%"
                              value={recipient.split}
                              onChange={(e) => {
                                // handleRecipientChange(
                                //   index,
                                //   "split",
                                //   Number(parseFloat(e.target.value).toFixed(2))
                                // );
                                console.log(e.target.value);
                              }}
                            />
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
                {solanaEnabled.arrOnChainSplitRecipients.length < 5 && (
                  <Button
                    color="teal"
                    size="sm"
                    variant="filled"
                    className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                    onClick={() => addSolInputBox({ boxName: "onChainSplits" })}
                  >
                    <BsPlus />
                    Add Recipient
                  </Button>
                )}
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
                  checked={solanaEnabled.limitNoOfEditions}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      limitNoOfEditions: !solanaEnabled.limitNoOfEditions,
                    })
                  }
                  className={`${
                    solanaEnabled.limitNoOfEditions
                      ? "bg-[#008080]"
                      : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.limitNoOfEditions
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
                !solanaEnabled.limitNoOfEditions && "hidden"
              } ml-4 mr-4`}
            >
              <InputBox placeholder="100" value={""} onChange={handleChange} />
            </div>
            {/* Switch Number 3 End */}

            {/* Switch Number 4 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Schedule your Mint </h2>
                <Switch
                  checked={solanaEnabled.scheduleMint}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      scheduleMint: !solanaEnabled.scheduleMint,
                    })
                  }
                  className={`${
                    solanaEnabled.scheduleMint ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.scheduleMint
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
                !solanaEnabled.scheduleMint && "hidden"
              } `}
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
                  checked={solanaEnabled.allowlist}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      allowlist: !solanaEnabled.allowlist,
                    })
                  }
                  className={`${
                    solanaEnabled.allowlist ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.allowlist
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
              className={`ml-4 mr-4 ${!solanaEnabled.allowlist && "hidden"} `}
            >
              {solanaEnabled.arrAllowlist.map((recipient, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="flex justify-between gap-2 items-center w-full py-2"
                    >
                      <InputBox
                        placeholder="ERC20 Address"
                        value={recipient.recipient}
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
              {solanaEnabled.arrAllowlist.length < 5 && (
                <Button
                  color="teal"
                  size="sm"
                  variant="filled"
                  className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                  onClick={() => addSolInputBox({ boxName: "allowlist" })}
                >
                  <BsPlus />
                  Add Recipient
                </Button>
              )}

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
                  checked={solanaEnabled.nftBurn}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      nftBurn: !solanaEnabled.nftBurn,
                    })
                  }
                  className={`${
                    solanaEnabled.nftBurn ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.nftBurn ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add NFT Contract Addresses{" "}
              </div>
            </div>
            <div className={`${!solanaEnabled.nftBurn && "hidden"} ml-4 mr-4 `}>
              {solanaEnabled.arrNFTBurn.map((recipient, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="flex justify-between gap-2 items-center w-full py-2"
                    >
                      <InputBox
                        placeholder="ERC20 Address"
                        value={recipient.recipient}
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
              {solanaEnabled.arrNFTBurn.length < 5 && (
                <Button
                  color="teal"
                  size="sm"
                  variant="filled"
                  className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                  onClick={() => addSolInputBox({ boxName: "nftBurn" })}
                >
                  <BsPlus />
                  Add Recipient
                </Button>
              )}
            </div>
            {/* Switch Number 5 End */}

            {/* Switch Number 6 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> NFT Gate </h2>
                <Switch
                  checked={solanaEnabled.nftGate}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      nftGate: !solanaEnabled.nftGate,
                    })
                  }
                  className={`${
                    solanaEnabled.nftGate ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.nftGate ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Add NFT contract addresses to gate{" "}
              </div>
            </div>
            <div className={`${!solanaEnabled.nftGate && "hidden"} ml-4 mr-4 `}>
              {solanaEnabled.arrNFTGate.map((recipient, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="flex justify-between gap-2 items-center w-full py-2"
                    >
                      <InputBox
                        placeholder="ERC20 Address"
                        value={recipient.recipient}
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
              {solanaEnabled.arrNFTGate.length < 5 && (
                <Button
                  color="teal"
                  size="sm"
                  variant="filled"
                  className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                  onClick={() => addSolInputBox({ boxName: "nftGate" })}
                >
                  <BsPlus />
                  Add Recipient
                </Button>
              )}
            </div>
            {/* Switch Number 6 End */}

            {/* Switch Number 7 Start */}
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Token Gate </h2>
                <Switch
                  checked={solanaEnabled.tokenGate}
                  onChange={() =>
                    setSolanaEnabled({
                      ...solanaEnabled,
                      tokenGate: !solanaEnabled.tokenGate,
                    })
                  }
                  className={`${
                    solanaEnabled.tokenGate ? "bg-[#008080]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      solanaEnabled.tokenGate
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
              className={`${!solanaEnabled.tokenGate && "hidden"} ml-4 mr-4 `}
            >
              {solanaEnabled.arrTokenGate.map((recipient, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="flex justify-between gap-2 items-center w-full py-2"
                    >
                      <InputBox
                        placeholder="ERC20 Address"
                        value={recipient.recipient}
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
              {solanaEnabled.arrTokenGate.length < 5 && (
                <Button
                  color="teal"
                  size="sm"
                  variant="filled"
                  className="flex items-center gap-3 mt-2 ml-0 mr-4 "
                  onClick={() => addSolInputBox({ boxName: "tokenGate" })}
                >
                  <BsPlus />
                  Add Recipient
                </Button>
              )}
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
