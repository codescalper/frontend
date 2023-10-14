import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  AlphaWalletAdapter,
  BitKeepWalletAdapter,
  CensoWalletAdapter,
  AvanaWalletAdapter,
  CloverWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { useSolanaWalletError } from "../../hooks/solana";

const SolanaWalletProvider = ({ children }) => {
  const { onSolanaWalletError } = useSolanaWalletError();

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Testnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new AlphaWalletAdapter(),
      new BitKeepWalletAdapter(),
      new CensoWalletAdapter(),
      new AvanaWalletAdapter(),
      new CloverWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    [network]
  );

  const onError = useCallback((error) => {
    // console.log({
    //   message: error.message ? `${error.name}: ${error.message}` : error.name,
    // });
    if (error.message) {
      onSolanaWalletError(true, error.name, error.message);
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
