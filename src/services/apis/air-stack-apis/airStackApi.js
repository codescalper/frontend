import { gql } from "@apollo/client";
import request from "graphql-request";
import { AIRSTACK_API_KEY } from "../../env/env";

export const AIRSTACK_API = "https://api.airstack.xyz/gql";

const getENSDomainQuery = gql`
  query MyQuery($owners: [Identity!]) {
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
    const result = await request(
      AIRSTACK_API,
      getENSDomainQuery,
      variables
      //   {
      //   Authorization: AIRSTACK_API_KEY,
      // }
    );

    let arr = [];

    // check which address has ens
    address.map((addr) => {
      const ens = result?.Domains?.Domain.find(
        (d) => (d?.owner).toLowerCase() === addr.toLowerCase() && d?.isPrimary
      );
      if (ens) {
        arr.push(ens?.name);
      } else {
        arr.push(addr);
      }
    });

    return arr;
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
        isDefault
        profileHandle
        userAddress
      }
    }
  }
`;

export const getSocialDetails = async (address, dappName) => {
  const variables = {
    identities: address, // array of addresses
    dappName,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getSocialDetailsQuery,
      variables
      // {
      //   Authorization: AIRSTACK_API_KEY,
      // }
    );

    let arr = [];

    // check which address has a social profile
    address.map((addr) => {
      const social = result?.Socials?.Social.find(
        (s) => (s?.userAddress).toLowerCase() === addr.toLowerCase()
      );
      if (social) {
        arr.push(social?.profileHandle);
      } else {
        arr.push(addr);
      }
    });

    return arr;
  } catch (error) {
    // console.log(error);
    return address;
  }
};
