import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai, zora, zoraTestnet } from "wagmi/chains";
import {
  coinbaseWallet,
  metaMaskWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";

import ContextProvider from "./context/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ENVIRONMENT, WALLETCONNECT_PROJECT_ID } from "./services/env/env";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app/App";
import { AuthComponent } from "./app/auth";
import { TourProvider } from "@reactour/tour";
import { OnboardingSteps } from "./app/editor/common";

const radius = 8;

const { chains, publicClient } = configureChains(
  ENVIRONMENT === "production" ? [polygon, zora] : [polygonMumbai, zoraTestnet],
  [
    // alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains }),
      phantomWallet({ chains }),
      rabbyWallet({ chains }),
      rainbowWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
      walletConnectWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
      coinbaseWallet({ chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

export const Wrapper = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <ContextProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      {/* Reactour wrap around Start */}

                      <TourProvider
                        steps={OnboardingSteps}
                        padding={{
                          mask: 4,
                          popover: [64, 8],
                          wrapper: 0,
                        }}
                        styles={{
                          popover: (base) => ({
                            ...base,
                            "--reactour-accent": "#2c346b",
                            borderRadius: radius,
                            // top: 32,
                            marginTop: "24",
                            marginRight: "64",
                            marginBottom: "32",
                          }),
                          maskArea: (base) => ({ ...base, rx: radius }),
                          maskWrapper: (base) => ({ ...base, color: "" }),
                          badge: (base) => ({
                            ...base,
                            right: "auto",
                            left: "-0.8em",
                          }),
                          controls: (base) => ({ ...base, marginTop: 24 }),
                          close: (base) => ({
                            ...base,
                            left: "auto",
                            right: 16,
                            top: 24,
                          }),
                        }}
                      >
                        <App />
                      </TourProvider>

                      {/* Reactour wrap around End */}
                    </>
                  }
                />
                <Route path="/ifUserEligible" element={<AuthComponent />} />
              </Routes>
              {ENVIRONMENT === "localhost" && <ReactQueryDevtools />}
            </BrowserRouter>
          </QueryClientProvider>
        </ContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
