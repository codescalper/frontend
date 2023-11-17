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
  ledgerWallet,
  metaMaskWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
import { ENVIRONMENT, WALLETCONNECT_PROJECT_ID } from "../../services";

const { chains, publicClient } = configureChains(
  // [polygon],
  ENVIRONMENT === "production" ? [polygon] : [polygonMumbai],
  [
    // alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
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

const EVMWalletProvider = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default EVMWalletProvider;
