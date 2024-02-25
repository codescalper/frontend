import { BaseLogo, EthLogo, ZoraLogo, OpMainnetLogo } from "../assets";

export const chainLogo = (chainId) => {
  if (chainId === 1 || chainId === 5 || chainId === 11155111) {
    return EthLogo;
  } else if (chainId === 8453 || chainId === 84532) {
    return BaseLogo;
  } else if (chainId === 7777777) {
    return ZoraLogo;
  } else if (chainId === 10) {
    return OpMainnetLogo;
  }
};
