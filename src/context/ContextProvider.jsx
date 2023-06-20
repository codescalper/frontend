import React, { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        text,
        setText,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
