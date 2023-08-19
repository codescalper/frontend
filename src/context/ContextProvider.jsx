import createStore from "polotno/model/store";
import React, { createContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { POLOTNO_API_KEY } from "../services";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  // create canvas store
  const store = createStore({ key: POLOTNO_API_KEY });
  window.store = store;
  store.addPage();

  const { address, isConnected } = useAccount();
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

  // for calendar
  const [stFormattedDate, setStFormattedDate] = useState("");
  const [stFormattedTime, setStFormattedTime] = useState("");
  const [stCalendarClicked, setStCalendarClicked] = useState(false);

  // for preview
  const [fastPreview, setFastPreview] = useState([]);

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
        store,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
