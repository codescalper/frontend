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
    const result = await request(AIRSTACK_API, getENSDomainQuery, variables, 
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