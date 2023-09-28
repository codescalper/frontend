import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import ContextProvider from "./context/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ENVIRONMENT } from "./services/env/env";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./app/App";
import { AuthComponent } from "./app/auth";
import { TourProvider } from "@reactour/tour";
import { OnboardingSteps } from "./app/editor/common";

const radius = 8;

const { chains, provider } = configureChains(
  [ENVIRONMENT === "production" ? polygon : polygonMumbai],
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
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ContextProvider>
          <QueryClientProvider client={queryClient}>
            {/* <BrowserRouter> */}
              {/* <Routes>
                <Route path="/" element={ */}
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
                      badge: (base) => ({ ...base, right: "auto", left: "-0.8em" }),
                      controls: (base) => ({ ...base, marginTop: 24 }),
                      close: (base) => ({ ...base, left: "auto", right: 16, top: 24 }),
                    }}
                    >
                    <App />
                    </TourProvider>

                  {/* Reactour wrap around End */}
                  </>
                {/* }
                /> */}
                {/* <Route path="/ifUserEligible" element={<AuthComponent />} />
              </Routes> */}
              {ENVIRONMENT === "localhost" && <ReactQueryDevtools />}
            {/* </BrowserRouter> */}
          </QueryClientProvider>
        </ContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};