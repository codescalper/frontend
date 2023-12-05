import { gql } from "@apollo/client";
import request from "graphql-request";
import { AIRSTACK_API_KEY } from "../../env/env";

export const AIRSTACK_API = "https://api.airstack.xyz/gql";

export const getENSDomainQuery = gql`
  query MyQuery($owner: Identity!) {
    Domains(
      input: { filter: { owner: { _in: $owners } }, blockchain: ethereum }
    ) {
      Domain {
        isPrimary
        name
        owner
      }
    }
  }
`;

export const getENSDomain = async (address) => {
  const variables = {
    owners: address, // array of addresses
  };

  try {
    const result = await request(AIRSTACK_API, getENSDomainQuery, variables, {
      authorization: AIRSTACK_API_KEY,
    });

    const domain = result?.Domains?.Domain?.find((d) => d.isPrimary);

    if (domain) {
      return domain.name;
    } else {
      return address;
    }
  } catch (error) {
    // console.log(error);
    return address;
  }
};

const getSocialDetailsQuery = gql`
  query MyQuery($identities: [Identity!], $dappName: SocialDappName) {
    Socials(
      input: {
        filter: { identity: { _in: $identities }, dappName: { _eq: $dappName } }
        blockchain: ethereum
      }
    ) {
      Social {
        id
        isDefault
        blockchain
        dappName
        profileHandle
      }
    }
  }
`;


export const getSocialDetails = async (address, dappName) => {
  const variables = {
    identities: [address],
    dappName,
  };

  try {
    const result = await request(AIRSTACK_API, getSocialDetailsQuery, variables);
    
    const social = result?.Socials?.Social.find((s) => s?.profileHandle);

    if (social) {
      return social?.profileHandle;
    } else {
      return address;
    }
  } catch (error) {
    // console.log(error);
    return address;
  }
}