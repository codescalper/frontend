import "@rainbow-me/rainbowkit/styles.css";
import App from "./App";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import ContextProvider from "./context/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ENVIRONMENT } from "./services/env";

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
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            {ENVIRONMENT === "development" && <ReactQueryDevtools />}
          </QueryClientProvider>
        </ContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
