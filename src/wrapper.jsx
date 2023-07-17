import React, { useState, useEffect } from 'react';
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import ContextProvider from "./context/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ENVIRONMENT } from "./services/env";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { ethers } from "ethers";
import { ERC1155ABI, NFTContractAddress } from "./tokengating/NFTCredentials";
import LoginComp from "./tokengating/LoginComp";

const { chains, provider } = configureChains(
  [polygon],
  [
    // alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "LensPost",
  projectId: "755e88fd4f93da5f0dadcf2dee54e6a0",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const queryClient = new QueryClient();


export const Wrapper = () => {
  const { address, isConnected } = useAccount();
  
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />

            {/* For tokengating - Ethersjs - 16Jul2023 */}

            {/* <Router>
              <TokenGatedRoute
                  exact
                  path="/"
                  component={App}
                  tokenContractAddress="0x2953399124F0cBB46d2CbACD8A89cF0599974963"
                  ERC1155ABI = {ERC1155ABI}
                  tokenID = "47802986143454222809304737278664052137172229238287818104360090302254877245540"
                  redirectPath="/login"
                /> 
                <Route path="/login" component={LoginComp} />
            </Router> */}

            {ENVIRONMENT === "development" && <ReactQueryDevtools />}
          </QueryClientProvider>
        </ContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

// Tokengating 16Jul2023

const TokenGatedRoute = ({
  component: Component,
  tokenContractAddress,
  redirectPath,
  tokenID,
  ERC1155ABI,
  ...rest
}) => {
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [walAddress, setWalAddress] = useState(address);

  useEffect(() => {
    const checkTokenOwnership = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          tokenContractAddress,
          ERC1155ABI,
          signer
        );

        // Get the balance of the connected wallet address for the specific token contract
        // const balance = await tokenContract.balanceOf(signer.getAddress());
        console.log(walAddress);
        const balance = await tokenContract.balanceOf(walAddress, tokenID);

        // Check if the balance is greater than zero
        const hasToken = balance.gt(0);

        setHasToken(hasToken);
        setLoading(false);
      } catch (error) {
        console.error("Error checking token ownership:", error);
      }
    };

    if (window.ethereum && tokenContractAddress) {
      checkTokenOwnership();
    } else {
      setLoading(false);
    }
     
    if (!walAddress) {
      setLoading(false);
      setHasToken(false);
    }
  }, [tokenContractAddress]);

  if (loading) {
    // Show a loading spinner or skeleton screen while checking token ownership
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
         hasToken ? (
          <Component {...props} />
        ) : (
          // <Redirect to={redirectPath} />
          <LoginComp/>
        )
      }
    />
  );
};
