/**
 * Generates a Zora URL based on the contract address.
 * @param {string} contractAddress - The address of the contract.
 * @returns {string} The Zora URL.
 */
import { ENVIRONMENT } from "../../../../../../../services";

/**
 * https://testnet.zora.co/collect/gor:0x56134d20bc6e559431c3720661f703a6f672d22c
 * ERC721 Testnet Goerli
 */

export const zoraURLErc721 = (contractAddress) => {
  return `https://${ENVIRONMENT != "production" && "testnet."}zora.co/collect/${
    ENVIRONMENT != "production" ? "gor" : "zora"
  }:${contractAddress}`;
};

/**
 * https://testnet.zora.co/collect/zgor:0x40583f3414f276fee55c126151e6a28dcafe4df8/premint-2 erc1155
 * ERC1155 Testnet Goerli
 * 
 * https://zora.co/collect/zora:0x40583f3414f276fee55c126151e6a28dcafe4df8/premint-1
 * ERC1155 Mainnet Zora
 */

export const zoraURLErc1155 = (contractAddress, tokenId) => {
    return `https://${ENVIRONMENT != "production" && "testnet."}zora.co/collect/${
        ENVIRONMENT != "production" ? "zgor" : "zora"
    }:${contractAddress}/premint-${tokenId}`;
}