import React, { createContext, useEffect, useRef, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [isTokengated, setIsTokengated] = useState(false);
  const contextCanvasIdRef = useRef(null);
  const [queryParams, setQueryParams] = useState({
    oauth_token: "",
    oauth_verifier: "",
  });

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        isTokengated,
        setIsTokengated,
        text,
        setText,
        contextCanvasIdRef,
        queryParams,
        setQueryParams,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
