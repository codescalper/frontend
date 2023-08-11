import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BiChevronRight from "@meronex/icons/bi/BiChevronRight";
import { ShareIcon } from "../editor-icon";
import MdcCalendarClock from "@meronex/icons/mdc/MdcCalendarClock";
import BsLink45Deg from "@meronex/icons/bs/BsLink45Deg";
import { Switch } from "@headlessui/react";
import { Icon } from "@blueprintjs/core";
import {
  checkDispatcher,
  lensAuthenticate,
  setDispatcher,
  shareOnSocials,
  twitterAuthenticate,
  twitterAuthenticateCallback,
} from "../../services/backendApi";
import { useAccount, useSignMessage } from "wagmi";
import {
  lensChallenge,
  lensHub,
  signSetDispatcherTypedData,
  splitSignature,
} from "../../../lensApi";
import { Context } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../services/localStorage";
import { Button } from "@blueprintjs/core";

// New Imports :
// import { DatePicker, Space } from "antd"
import { DateTimePicker } from "@atlaskit/datetime-picker";
import { useNavigate } from "react-router-dom";

// Emoji Implementation - 21Jul2023
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";
import { fnMessage } from "../../services/fnMessage";
import { AiFillDelete } from "react-icons/ai";
import { data } from "autoprefixer";

export default function RightDrawer({}) {
  const [open, setOpen] = useState(false);
  // const [menu, setMenu] = useState("share");
  const [stIsActive, setStIsActive] = useState("false");
  const { menu, setMenu } = useContext(Context);

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        <ShareIcon />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-0"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-0"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-scroll">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 top-20">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-sm">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="">
                        <div className="absolute left-0 top-0  flex flex-col items-center justify-center">
                          <div
                            className="-ml-32 flex items-center justify-center flex-col"
                            onClick={() => {
                              setMenu("share");
                            }}
                          >
                            {/* <button
                              className={`${
                                menu == "share" ? "bg-[#E1F26C]" : "bg-white"
                              } h-12 w-12 rounded-full outline-none`}
                            >
                              <Icon icon="share" size={16} />
                            </button> */}
                            {/* <p>Share</p> */}
                          </div>
                          <div
                            className="-ml-32 flex items-center justify-center flex-col"
                            onClick={() => {
                              setMenu("monetization");
                              setStIsActive(!stIsActive);
                            }}
                          >
                            {/* <button
                              className={`${
                                menu == "monetization"
                                  ? "bg-[#E1F26C]"
                                  : "bg-white"
                              } h-12 w-12 rounded-full outline-none`}
                            >
                              <Icon icon="dollar" size={16} />
                            </button> */}
                            {/* <p className="w-20 text-center">Monetization</p> */}
                          </div>
                          <div
                            className="-ml-32 flex items-center justify-center flex-col"
                            onClick={() => {
                              setMenu("post");
                            }}
                          >
                            {/* <button
                              className={`${
                                menu == "post" ? "bg-[#E1F26C]" : "bg-white"
                              } h-12 w-12 rounded-full outline-none`}
                            >
                     
                              <Icon icon="settings" size={16} />
                            </button> */}
                            {/* <p className="w-20 text-center">Comment & Mirror</p> */}
                          </div>
                        </div>
                        <div className="absolute left-0 top-1/2 flex -ml-5 flex-col items-center justify-center">
                          <button
                            type="button"
                            className="rounded-xl outline-none "
                            onClick={() => setOpen(false)}
                          >
                            <BiChevronRight className="h-10 w-6 bg-white rounded-sm" />
                          </button>
                        </div>
                      </div>
                    </Transition.Child>

                    {menu === "share" && <Share />}
                    {menu === "monetization" && <Monetization />}
                    {/* {menu === "post" && <Post />} */}
                    {/* {menu === "post" && <Post />} */}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

const Share = () => {
  const [stShareClicked, setStShareClicked] = useState(false);
  const [stSelectedDateTime, setStSelectedDateTime] = useState();
  const { address, isConnected } = useAccount();
  const {
    setMenu,
    postDescription,
    setPostDescription,
    stFormattedDate,
    setStFormattedDate,
    stFormattedTime,
    setStFormattedTime,
    stCalendarClicked,
    setStCalendarClicked,
  } = useContext(Context);
  const getTwitterAuth = getFromLocalStorage("twitterAuth");

  // Aurh for twitter
  const twitterAuth = async () => {
    const res = await twitterAuthenticate();
    if (res?.data) {
      // console.log(res?.data?.message);
      window.open(res?.data?.message, "_parent");
    } else if (res?.error) {
      toast.error(res?.error);
    }
  };

  const handleTwitterClick = () => {
    if (isConnected && getTwitterAuth) {
      sharePost("twitter");
    } else {
      twitterAuth();
    }
  };
  // Calendar Functions:
  const onCalChange = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    setStSelectedDateTime(value);

    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    setStFormattedDate(dateTime.toLocaleDateString(undefined, dateOptions));

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };
    setStFormattedTime(dateTime.toLocaleTimeString(undefined, timeOptions));
  };

  const [stSelectedEmoji, setStSelectedEmoji] = useState("");
  const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState(false);

  // Function to handle emoji click
  // Callback sends (data, event) - Currently using data only
  function fnEmojiClick(emojiData) {
    console.log("Selected Emoji");
    setStSelectedEmoji(emojiData?.unified);
    setPostDescription(postDescription + emojiData?.emoji); //Add emoji to description
  }

  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
      <div className="">
        <Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
          Share this Design
        </Dialog.Title>
      </div>
      <div className="relative mt-16 px-4 pt-2 pb-1 sm:px-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between"></div>
          <div className="space-x-2">
            <textarea
              onChange={(e) => setPostDescription(e.target.value)}
              value={postDescription}
              className="border border-b-4 w-full h-40 mb-2 text-lg"
            />

            <div className="flex flex-row">
              {/* Open the emoji panel - 22Jul2023 */}
              {/* Dynamic Emoji on the screen based on click */}

              <button
                title="Open emoji panel"
                className={`"m-2 p-2 rounded-md ${
                  stClickedEmojiIcon && "border border-red-400"
                }"`}
                onClick={() => setStClickedEmojiIcon(!stClickedEmojiIcon)}
              >
                <Emoji
                  unified={stClickedEmojiIcon ? "274c" : "1f60a"}
                  emojiStyle={EmojiStyle.NATIVE}
                  size={24}
                />
              </button>
              <div
                onClick={() => {
                  setStCalendarClicked(!stCalendarClicked);
                  setStShareClicked(true);
                }}
                className=" ml-4 py-2 rounded-md cursor-pointer"
              >
                {/* <MdcCalendarClock className="h-10 w-10" /> */}
              </div>
            </div>

            {/* Emoji Implementation - 21Jul2023 */}
            {stClickedEmojiIcon && (
              <div className="shadow-lg mt-2 absolute z-40">
                <EmojiPicker
                  onEmojiClick={fnEmojiClick}
                  autoFocusSearch={true}
                  width="96%"
                  lazyLoadEmojis={true}
                  previewConfig={{
                    defaultCaption: "Pick one!",
                    defaultEmoji: "1f92a", // 🤪
                  }}
                  searchPlaceHolder="Filter"
                  emojiStyle={EmojiStyle.NATIVE}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calender For Schedule - 18Jun2023 */}
      <div className={`${!stCalendarClicked && "hidden"}`}>
        <div
          className={`
        ml-6 mr-6 mb-4`}
        >
          <div className="m-1">Choose schedule time and date</div>
          <DateTimePicker className="m-4" onChange={onCalChange} />
        </div>

        <div className={`flex flex-col m-2 ml-8`}>
          <div className="mt-1 mb-3">Schedule</div>
          <div className="flex flex-row border-l-8 border-l-[#E1F26C] p-4 rounded-md">
            <div className="flex flex-col">
              <div className="text-4xl text-[#E699D9]">
                {stFormattedDate.slice(0, 2)}
              </div>
              <div className="text-lg text-[#2D346C]">
                {stFormattedDate.slice(2)}
              </div>
            </div>

            <div className="flex flex-col ml-4">
              <div className="ml-2 mt-10">{stFormattedTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Share - Icons - 18Jun2023 */}
      <hr />
      <div className={`relative mt-6 px-4 sm:px-6`}>
        <p className="text-lg">Share on socials</p>
        <div className="flex items-center space-x-12 py-5">
          <div onClick={() => setMenu("monetization")}>
            {" "}
            <img
              className="w-10 cursor-pointer"
              src="/other-icons/share-section/iconLens.png"
              alt="Lens"
            />{" "}
          </div>
          {/* <div onClick={handleTwitterClick}>
            {" "}
            <img
              className="w-10 cursor-pointer"
              src="/other-icons/share-section/iconTwitter.png"
              alt="Twitter"
            />{" "}
          </div> */}
        </div>
      </div>
      <hr />
    </div>
  );
};

const Monetization = () => {
  const { contextCanvasIdRef } = useContext(Context);
  const { address, isConnected } = useAccount();
  const [dispatcherState, setDispatcherState] = useState({
    message: false,
    profileId: "",
  });
  const {
    isLoading,
    setIsLoading,
    text,
    setText,
    queryParams,
    setMenu,
    postDescription,
    setPostDescription,
    enabled,
    setEnabled,
    stFormattedTime,
    stFormattedDate,
  } = useContext(Context);
  const {
    data: signature,
    isError,
    isSuccess,
    error,
    signMessage,
  } = useSignMessage();
  const getLensAuth = getFromLocalStorage("lensAuth");
  const getTwitterAuth = getFromLocalStorage("twitterAuth");
  const navigate = useNavigate();
  const [duplicateAddressError, setDuplicateAddressError] = useState(false);
  const [percentageError, setPercentageError] = useState(false);

  // Calendar Functions:
  const onCalChange = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    // setStSelectedDateTime(value);

    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    setEnabled({
      ...enabled,
      endTimestamp: {
        date: dateTime.toLocaleDateString(undefined, dateOptions),
        time: dateTime.toLocaleTimeString(undefined, timeOptions),
      },
    });
  };

  // get contract address acoording to currency
  const getContractAddressOfCurrency = (currency) => {
    if (currency === "wmatic") {
      return "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
    } else if (currency === "weth") {
      return "0x3C68CE8504087f89c640D02d133646d98e64ddd9";
    } else if (currency === "dai") {
      return "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F";
    } else if (currency === "usdc") {
      return "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
    }
  };

  // formate date and time in ISO 8601 format for monatizationnsettings
  const formatDateTime = (date, time) => {
    if (!date || !time) return;
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.toISOString();
  };

  // format date and time in unix format for schedule post
  const formatDateTimeUnix = (date, time) => {
    if (!date || !time) return;
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.getTime();
  };

  // generating signature
  const generateSignature = async () => {
    const message = await lensChallenge(address);
    setIsLoading(true);
    signMessage({
      message,
    });
    setText("Sign the message to authenticate");
  };

  // check for dispatcher
  const checkDispatcherFn = async () => {
    const res = await checkDispatcher();
    if (res?.message === true) {
      setDispatcherState({
        message: true,
        profileId: res?.profileId,
      });
    } else if (res?.message === false) {
      setDispatcherState({
        message: false,
        profileId: res?.profileId,
      });
    } else if (res?.error) {
      return toast.error(res?.error);
    }
  };

  // monatization settings
  const monatizationSettings = () => {
    if (
      !enabled.chargeForCollect &&
      !enabled.limitedEdition &&
      !enabled.timeLimit &&
      !enabled.whoCanCollect
    ) {
      return false;
    }

    let canvasParams = {
      collectModule: {
        multirecipientFeeCollectModule: {
          followerOnly: enabled.whoCanCollect,
        },
      },
    };

    if (enabled.chargeForCollect) {
      canvasParams.collectModule.multirecipientFeeCollectModule = {
        ...canvasParams.collectModule.multirecipientFeeCollectModule,
        amount: {
          currency: getContractAddressOfCurrency(
            enabled.chargeForCollectCurrency
          ),
          value: enabled.chargeForCollectPrice,
        },
      };
    }

    if (enabled.splitRevenue) {
      canvasParams.collectModule.multirecipientFeeCollectModule = {
        ...canvasParams.collectModule.multirecipientFeeCollectModule,
        recipients: enabled.splitRevenueRecipients,
      };
    }

    if (enabled.mirrorReferralReward) {
      canvasParams.collectModule.multirecipientFeeCollectModule = {
        ...canvasParams.collectModule.multirecipientFeeCollectModule,
        referralFee: enabled.mirrorReferralRewardFee,
      };
    }

    if (enabled.limitedEdition) {
      canvasParams.collectModule.multirecipientFeeCollectModule = {
        ...canvasParams.collectModule.multirecipientFeeCollectModule,
        collectLimit: enabled.limitedEditionNumber,
      };
    }

    if (enabled.timeLimit) {
      canvasParams.collectModule.multirecipientFeeCollectModule = {
        ...canvasParams.collectModule.multirecipientFeeCollectModule,
        endTimestamp: formatDateTime(
          enabled.endTimestamp.date,
          enabled.endTimestamp.time
        ),
      };
    }

    return canvasParams;
  };

  const setDispatcherFn = async () => {
    try {
      setIsLoading(true);
      setText("Sign the message to enable dispatcher");

      const setDispatcherRequest = await setDispatcher();

      const signedResult = await signSetDispatcherTypedData(
        setDispatcherRequest
      );

      const typedData = signedResult.typedData;
      const { v, r, s } = splitSignature(signedResult.signature);
      const tx = await lensHub.setDispatcherWithSig({
        profileId: typedData.value.profileId,
        dispatcher: typedData.value.dispatcher,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });
      // checkDispatcherFn();
      // console.log("successfully set dispatcher: tx hash", tx.hash);
      // if tx.hash? => sharePost()
      if (tx.hash) {
        setIsLoading(false);
        setText("");
        toast.success("Dispatcher enabled");
        setTimeout(() => {
          sharePost("lens");
        }, 4000);
      }
    } catch (err) {
      console.log("error setting dispatcher: ", err);
      toast.error("Error setting dispatcher");
      setIsLoading(false);
      setText("");
    }
  };

  // authenticating signature on lens
  const lensAuth = async () => {
    setText("Authenticating...");
    const res = await lensAuthenticate(signature);
    if (res?.data) {
      saveToLocalStorage("lensAuth", true);
      toast.success("Successfully authenticated");
      setIsLoading(false);
      setText("");
      checkDispatcherFn();
      setTimeout(() => {
        // check the dispatcher
        // if true => sharePost
        if (dispatcherState.message === true) {
          sharePost("lens");
          // console.log("share on lens");
        } else if (dispatcherState.message === false) {
          // else => set the dispatcher
          setDispatcherFn();
        }
      }, 4000);
    } else if (res?.error) {
      toast.error(res?.error);
      setIsLoading(false);
      setText("");
    }
  };

  // share post on lens
  const sharePost = async (platform) => {
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

    if (isAddressDuplicate()) {
      setDuplicateAddressError(true);
      return;
    }

    if (isPercentageMoreThan100()) {
      setPercentageError(true);
      return;
    }

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "post",
      content: postDescription,
    };

    const id = toast.loading(`Sharing on ${platform}...`);
    const res = await shareOnSocials(
      canvasData,
      monatizationSettings(),
      platform,
      formatDateTimeUnix(stFormattedDate, stFormattedTime)
    );
    if (res?.data?.txHash) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
        confettiNumber: 100,
      });
      toast.update(id, {
        render: `Successfully shared on ${platform}`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      // setCanvasId("");
      setPostDescription("");
    } else if (res?.error) {
      toast.update(id, {
        render: res?.error,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } else {
      toast.update(id, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }
  };

  // funtions to handle split revenue
  const addRecipient = () => {
    if (enabled.splitRevenueRecipients.length < 4) {
      setEnabled({
        ...enabled,
        splitRevenueRecipients: [
          ...enabled.splitRevenueRecipients,
          { recipient: "", split: 0.0 },
        ],
      });
    }
  };

  const removeRecipient = (index) => {
    if (enabled.splitRevenueRecipients.length === 1) {
      return setEnabled({
        ...enabled,
        splitRevenue: false,
      });
    }
    const updatedRecipients = enabled.splitRevenueRecipients.filter(
      (_, i) => i !== index
    );
    setEnabled({
      ...enabled,
      splitRevenueRecipients: updatedRecipients,
    });
  };

  const handleRecipientChange = (index, field, value) => {
    const updatedRecipients = [...enabled.splitRevenueRecipients];
    updatedRecipients[index][field] = value;
    setEnabled({
      ...enabled,
      splitRevenueRecipients: updatedRecipients,
    });
  };

  // check if recipient address is same
  const isAddressDuplicate = (walletAddress, currentIndex) => {
    const arr = enabled.splitRevenueRecipients;
    let isError = false;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (i !== j && arr[i].recipient === arr[j].recipient) {
          isError = true;
          break;
        }
      }
    }

    return isError;
  };

  // check if recipient percentage is more than 100
  const isPercentageMoreThan100 = () => {
    const arr = enabled.splitRevenueRecipients;
    let totalPercentage = 0;
    for (let i = 0; i < arr.length; i++) {
      totalPercentage += arr[i].percentage;
    }

    return totalPercentage > 80 ? true : false;
  };

  // if lensAuth = success => sharePost or else generateSignature then sharePost
  const handleLensClick = () => {
    if (isConnected && !getLensAuth) {
      generateSignature();
    } else if (isConnected && getLensAuth && !dispatcherState.message) {
      setDispatcherFn();
    } else if (isConnected && getLensAuth && dispatcherState.message) {
      sharePost("lens");
    }
  };

  useEffect(() => {
    if (isError && error?.name === "UserRejectedRequestError") {
      setIsLoading(false);
      toast.error("User rejected the signature request");
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      lensAuth();
    }
  }, [isSuccess]);

  useEffect(() => {
    checkDispatcherFn();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEnabled((prevEnabled) => ({ ...prevEnabled, [name]: value }));
  };

  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
      <div className="">
        <Dialog.Title className="w-full flex items-center gap-2 text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
          <Button
            className="mb-4 ml-1"
            icon="arrow-left"
            onClick={() => setMenu("share")}
          ></Button>
          Monetization Settings
        </Dialog.Title>
      </div>
      <div className="relative px-4 pt-4 pb-4 sm:px-6 mt-24">
        <div className="">
          <div className="flex flex-col justify-between">
            <Switch.Group>
              <div className="mb-4">
                <h2 className="text-lg mb-2">Charge for collecting</h2>
                <div className="flex justify-between">
                  <Switch.Label className="w-4/5">
                    Get paid when someone collects your post
                  </Switch.Label>
                  <Switch
                    checked={enabled.chargeForCollect}
                    onChange={() =>
                      setEnabled({
                        ...enabled,
                        chargeForCollect: !enabled.chargeForCollect,
                      })
                    }
                    className={`${
                      enabled.chargeForCollect ? "bg-[#E1F26C]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        enabled.chargeForCollect
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                <div
                  className={`flex gap-5 ${
                    !enabled.chargeForCollect && "hidden"
                  }`}
                >
                  <div className="flex flex-col w-1/2 py-2">
                    <label htmlFor="price">Price</label>
                    <input
                      className="border border-black rounded-md p-2"
                      type="number"
                      min={"0"}
                      step={"0.01"}
                      placeholder="0.0$"
                      onChange={(e) =>
                        setEnabled({
                          ...enabled,
                          chargeForCollectPrice: e.target.value,
                        })
                      }
                      value={enabled.chargeForCollectPrice}
                    />
                  </div>
                  <div className="flex flex-col w-1/2 py-2">
                    <label htmlFor="price">Currency</label>
                    <select
                      name="chargeForCollectCurrency"
                      id="cars"
                      className="border border-black rounded-md p-2"
                      onChange={handleChange}
                      value={enabled.chargeForCollectCurrency}
                    >
                      <option value="wmatic">Wrapped MATIC</option>
                      <option value="weth">Wrapped ETH</option>
                      <option value="dai">DAI</option>
                      <option value="usdc">USDC</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={`mb-4 ${!enabled.chargeForCollect && "hidden"}`}>
                <h2 className="text-lg mb-2">Mirror referral award</h2>
                <div className="flex justify-between">
                  <Switch.Label className="w-4/5">
                    Share your fee with people who amplify your content
                  </Switch.Label>
                  <Switch
                    checked={enabled.mirrorReferralReward}
                    onChange={() =>
                      setEnabled({
                        ...enabled,
                        mirrorReferralReward: !enabled.mirrorReferralReward,
                      })
                    }
                    className={`${
                      enabled.mirrorReferralReward
                        ? "bg-[#E1F26C]"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        enabled.mirrorReferralReward
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                <div
                  className={`flex ${
                    !enabled.mirrorReferralReward && "hidden"
                  }`}
                >
                  <div className="flex flex-col w-full py-2">
                    <label htmlFor="price">Referral fee(%)</label>
                    <input
                      className="border border-black rounded-md p-2"
                      type="number"
                      min={0.0}
                      max={100.0}
                      step={0.01}
                      placeholder="0.0%"
                      onChange={(e) =>
                        setEnabled({
                          ...enabled,
                          mirrorReferralRewardFee: Number(
                            parseFloat(e.target.value).toFixed(2)
                          ),
                        })
                      }
                      value={enabled.mirrorReferralRewardFee}
                    />
                  </div>
                </div>
              </div>
              <div className={`mb-4 ${!enabled.chargeForCollect && "hidden"}`}>
                <h2 className="text-lg mb-2">Split Revenue</h2>
                <div className="flex justify-between">
                  <Switch.Label className="w-4/5">
                    Set multiple recipients for the collect fee
                  </Switch.Label>
                  <Switch
                    checked={enabled.splitRevenue}
                    onChange={() =>
                      setEnabled({
                        ...enabled,
                        splitRevenue: !enabled.splitRevenue,
                      })
                    }
                    className={`${
                      enabled.splitRevenue ? "bg-[#E1F26C]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        enabled.splitRevenue ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                <div className={`${!enabled.splitRevenue && "hidden"}`}>
                  <p>Small fee to support our team!</p>
                  {enabled.splitRevenueRecipients.map((recipient, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className="flex justify-between gap-2 items-center w-full py-2"
                        >
                          <input
                            className="border border-black w-full rounded-md p-2"
                            type="text"
                            placeholder="er20 address or lens handle"
                            value={recipient.recipient}
                            onChange={(e) => {
                              handleRecipientChange(
                                index,
                                "recipient",
                                e.target.value
                              );
                            }}
                          />
                          <div className="flex justify-between items-center w-1/3">
                            <input
                              className="border border-black rounded-md p-2"
                              type="number"
                              min={0}
                              max={90}
                              step={0.01}
                              placeholder="0.0%"
                              value={recipient.split}
                              onChange={(e) => {
                                handleRecipientChange(
                                  index,
                                  "split",
                                  Number(parseFloat(e.target.value).toFixed(2))
                                );
                              }}
                            />
                            <AiFillDelete
                              className="h-6 w-6 cursor-pointer"
                              color="red"
                              onClick={() => removeRecipient(index)}
                            />
                          </div>
                        </div>
                      </>
                    );
                  })}
                  {duplicateAddressError && (
                    <p className="text-red-500 font-semibold italic">
                      Duplicate recipient address found
                    </p>
                  )}
                  {percentageError && (
                    <p className="text-red-500 font-semibold italic">
                      Splits cannot exceed 100%
                    </p>
                  )}
                  {enabled.splitRevenueRecipients.length < 4 && (
                    <button
                      className="bg-blue-500 text-white p-2 rounded outline-none"
                      onClick={addRecipient}
                    >
                      Add recipient
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-lg mb-2">Limited Edition</h2>
                <div className="flex justify-between">
                  <Switch.Label className="w-4/5">
                    Make the collects exclusive
                  </Switch.Label>
                  <Switch
                    checked={enabled.limitedEdition}
                    onChange={() =>
                      setEnabled({
                        ...enabled,
                        limitedEdition: !enabled.limitedEdition,
                      })
                    }
                    className={`${
                      enabled.limitedEdition ? "bg-[#E1F26C]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        enabled.limitedEdition
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                <div className={`flex ${!enabled.limitedEdition && "hidden"}`}>
                  <div className="flex flex-col w-full py-2">
                    <label htmlFor="price">Collect limit</label>
                    <input
                      className="border border-black rounded-md p-2"
                      type="number"
                      min={"1"}
                      step={"1"}
                      placeholder="1"
                      onChange={(e) =>
                        setEnabled({
                          ...enabled,
                          limitedEditionNumber: e.target.value,
                        })
                      }
                      value={enabled.limitedEditionNumber}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-lg mb-2">Time Limit</h2>
                <div className="flex justify-between">
                  <Switch.Label className="w-4/5">
                    Collect duration
                  </Switch.Label>
                  <Switch
                    checked={enabled.timeLimit}
                    onChange={() =>
                      setEnabled({ ...enabled, timeLimit: !enabled.timeLimit })
                    }
                    className={`${
                      enabled.timeLimit ? "bg-[#E1F26C]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        enabled.timeLimit ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                {/* Calender For Schedule - 18Jun2023 */}
                <div className={`${!enabled.timeLimit && "hidden"} my-3`}>
                  <div
                    className={`
                    flex flex-col w-full`}
                  >
                    {/* <div className="m-1">Choose schedule time and date</div> */}
                    <DateTimePicker className="m-4" onChange={onCalChange} />
                  </div>

                  <div className={`flex flex-col my-2`}>
                    <div className="mt-1 mb-3">Schedule</div>
                    <div className="flex flex-row border-l-8 border-l-[#E1F26C] p-4 rounded-md">
                      <div className="flex flex-col">
                        <div className="text-4xl text-[#E699D9]">
                          {enabled.endTimestamp.date.slice(0, 2)}
                        </div>
                        <div className="text-lg text-[#2D346C]">
                          {enabled.endTimestamp.date.slice(2)}
                        </div>
                      </div>

                      <div className="flex flex-col ml-4">
                        <div className="ml-2 mt-10">
                          {enabled.endTimestamp.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-lg mb-2">Who can collect</h2>
                <div className="flex justify-between">
                  <Switch.Label className="w-4/5">
                    Only followers can collect
                  </Switch.Label>
                  <Switch
                    checked={enabled.whoCanCollect}
                    onChange={() =>
                      setEnabled({
                        ...enabled,
                        whoCanCollect: !enabled.whoCanCollect,
                      })
                    }
                    className={`${
                      enabled.whoCanCollect ? "bg-[#E1F26C]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        enabled.whoCanCollect
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
            </Switch.Group>
          </div>
        </div>
        <button
          onClick={handleLensClick}
          className="flex items-center justify-center w-full text-md bg-[#E1F26C]  py-2 h-10 rounded-md outline-none"
        >
          <BsLink45Deg className="m-2" />
          Share Now
        </button>
      </div>
    </div>
  );
};

const Post = () => {
  return (
    <>
      <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
        <Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
          Comment and Mirror
        </Dialog.Title>
        Under DEV
        <div className="mt-24"></div>
      </div>
    </>
  );
};
