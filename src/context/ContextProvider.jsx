import React, { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [canvasId, setCanvasId] = useState("");

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        text,
        setText,
        canvasId,
        setCanvasId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
