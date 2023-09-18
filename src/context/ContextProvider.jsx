import React, { createContext, useRef, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const contextCanvasIdRef = useRef(null);

  // for twitter auth
  const [queryParams, setQueryParams] = useState({
    oauth_token: "",
    oauth_verifier: "",
  });

  // for open different menu in share
  const [menu, setMenu] = useState("share");

  // for lens monetization
  const [enabled, setEnabled] = useState({
    chargeForCollect: false,
    chargeForCollectPrice: "1",
    chargeForCollectCurrency: "WMATIC",

    mirrorReferralReward: false,
    mirrorReferralRewardFee: 25.0,

    splitRevenueRecipients: [
      {
        recipient: "",
        split: 0.0,
      },
    ],

    limitedEdition: false,
    limitedEditionNumber: "1",

    timeLimit: false,
    endTimestamp: {
      date: "",
      time: "",
    },

    whoCanCollect: false,
  });
  const [postDescription, setPostDescription] = useState("");
  const [open, setOpen] = useState(false);

  // for calendar
  const [stFormattedDate, setStFormattedDate] = useState("");
  const [stFormattedTime, setStFormattedTime] = useState("");
  const [stCalendarClicked, setStCalendarClicked] = useState(false);

  // for preview
  const [fastPreview, setFastPreview] = useState([]);

  // for split revenue eligible address/recipient
  const referredFromRef = useRef([]);

  // for split revenue eligible lens collect address/handles
  const lensCollectRecipientRef = useRef([{ elementId: "", handle: "" }]);

  // for split revenue eligible assets holder address/handles
  const assetsRecipientRef = useRef([{ elementId: "", handle: "" }]);

  // The parent Array for split revenue eligible assets holder address/handles
  const parentRecipientRef = useRef([]);

  // Right Sidebar
  const [isShareOpen, setIsShareOpen] = useState(false);

  // for lens monetization price error
  const [priceError, setPriceError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization split error
  const [splitError, setSplitError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization edition error
  const [editionError, setEditionError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization referral error
  const [referralError, setReferralError] = useState({
    isError: false,
    message: "",
  });

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        text,
        setText,
        contextCanvasIdRef,

        // for twitter auth
        queryParams,
        setQueryParams,

        // for open different menu in share
        menu,
        setMenu,

        // for lens monetization
        enabled,
        setEnabled,
        postDescription,
        setPostDescription,
        open,
        setOpen,

        // for calendar
        stFormattedDate,
        setStFormattedDate,
        stFormattedTime,
        setStFormattedTime,
        stCalendarClicked,
        setStCalendarClicked,

        // for preview
        fastPreview,
        setFastPreview,

        // Right Sidebar
        isShareOpen,
        setIsShareOpen,

        // user public templates states
        referredFromRef,

        // for split revenue eligible lens collect address/handles
        lensCollectRecipientRef,

        // for split revenue eligible assets holder address/handles
        assetsRecipientRef,

        // The parent Array for split revenue eligible assets holder address/handles
        parentRecipientRef,

        // for lens monetization price error
        priceError,
        setPriceError,

        // for lens monetization split error
        splitError,
        setSplitError,

        // for lens monetization edition error
        editionError,
        setEditionError,

        // for lens monetization referral error
        referralError,
        setReferralError,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
