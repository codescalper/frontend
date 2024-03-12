import {
  BaseLogo,
  EthLogo,
  ZoraLogo,
  OpMainnetLogo,
  arbitrumLogo,
} from "../assets";

const chainLogos = {
  1: EthLogo,
  5: EthLogo,
  8453: BaseLogo,
  7777777: ZoraLogo,
  10: OpMainnetLogo,
  42161: arbitrumLogo,
};

export const chainLogo = (chainId) => {
  return chainLogos[chainId] || null;
};
