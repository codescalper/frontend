import "@rainbow-me/rainbowkit/styles.css";

import App from "./App";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import ContextProvider from "./context/ContextProvider";

const { chains, provider } = configureChains(
  [polygon],
  [
    // alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "LensPost",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const Wrapper = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ContextProvider>
        <App />
        </ContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
