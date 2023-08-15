import React, { createContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const contextCanvasIdRef = useRef(null);
  const [queryParams, setQueryParams] = useState({
    oauth_token: "",
    oauth_verifier: "",
  });
  const [menu, setMenu] = useState("share");
  const [enabled, setEnabled] = useState({
    chargeForCollect: false,
    chargeForCollectPrice: "1",
    chargeForCollectCurrency: "WMATIC",

    mirrorReferralReward: false,
    mirrorReferralRewardFee: 25.0,

    splitRevenue: false,
    splitRevenueRecipients: [
      {
        recipient: isConnected ? address : "",
        split: 90.0,
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
  const [stFormattedDate, setStFormattedDate] = useState("");
  const [stFormattedTime, setStFormattedTime] = useState("");
  const [stCalendarClicked, setStCalendarClicked] = useState(false);
  const [fastPreview, setFastPreview] = useState("");

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        text,
        setText,
        contextCanvasIdRef,
        queryParams,
        setQueryParams,
        menu,
        setMenu,
        enabled,
        setEnabled,
        postDescription,
        setPostDescription,
        open,
        setOpen,
        stFormattedDate,
        setStFormattedDate,
        stFormattedTime,
        setStFormattedTime,
        stCalendarClicked,
        setStCalendarClicked,
        fastPreview,
        setFastPreview,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
