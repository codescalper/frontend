import { useContext, useState } from "react"; 
import { useAccount } from "wagmi";
import { Dialog } from "@headlessui/react";
import EmojiPicker, {
  EmojiStyle,
  Emoji,
} from "emoji-picker-react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import { getFromLocalStorage } from "../../../../../utils";
import { Context } from "../../../../../context/ContextProvider";

const Share = () => {
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
  const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState(false);

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

  // Function to handle emoji click
  // Callback sends (data, event) - Currently using data only
  function fnEmojiClick(emojiData) {
    setPostDescription(postDescription + emojiData?.emoji); //Add emoji to description
  }

  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
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
              placeholder="Write a description..."
              className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
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
          <div onClick={() => setMenu("lensmonetization")}>
            {" "}
            <img
              className="w-10 cursor-pointer"
              src="/other-icons/share-section/iconLens.png"
              alt="Lens"
            />{" "}
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Share;
