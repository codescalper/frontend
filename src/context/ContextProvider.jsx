import React, { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [walletNFTImages, setWalletNFTImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [lenspostNFTImages, setLenspostNFTImages] = useState([]);
  const [collection, setCollection] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [activeCat, setActiveCat] = useState(null);

  return (
    <Context.Provider
      value={{
        walletNFTImages,
        setWalletNFTImages,
        isLoading,
        setIsLoading,
        searchId,
        setSearchId,
        lenspostNFTImages,
        setLenspostNFTImages,
        collection,
        setCollection,
        contractAddress,
        setContractAddress,
        activeCat,
        setActiveCat,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
