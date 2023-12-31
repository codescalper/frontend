import { BaseLogo, EthLogo, ZoraLogo, OpMainnetLogo } from "../assets";

export const chainLogo = (chainId) => {
  if (chainId === 1 || chainId === 5) {
    return EthLogo;
  } else if (chainId === 8453) {
    return BaseLogo;
  } else if (chainId === 7777777) {
    return ZoraLogo;
  } else if (chainId === 10) {
    return OpMainnetLogo;
  }
};
