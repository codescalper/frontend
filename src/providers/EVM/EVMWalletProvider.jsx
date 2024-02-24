import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  base,
  baseSepolia,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  zora,
} from "wagmi/chains";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { ENVIRONMENT, WALLETCONNECT_PROJECT_ID } from "../../services";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        rainbowWallet,
        walletConnectWallet,
        rabbyWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: "Lenspost Studio",
    projectId: WALLETCONNECT_PROJECT_ID,
  }
);

/* New API that includes Wagmi's createConfig and replaces getDefaultWallets and connectorsForWallets */
const config = createConfig({
  connectors,
  chains:
    ENVIRONMENT === "production"
      ? [polygon, mainnet, base, zora, optimism]
      : [polygonMumbai, goerli, baseSepolia],
  transports: {
    [polygon.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
    [optimism.id]: http(),
    [polygonMumbai.id]: http(),
    [goerli.id]: http(),
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const EVMWalletProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default EVMWalletProvider;
