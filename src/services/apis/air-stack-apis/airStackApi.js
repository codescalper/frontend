import { gql } from "@apollo/client";
import request from "graphql-request";
import { AIRSTACK_API_KEY } from "../../env/env";
import { id } from "ethers/lib/utils";

export const AIRSTACK_API = "https://api.airstack.xyz/gql";

const getENSDomainQuery = gql`
  query MyQuery($owners: [Address!]) {
    Domains(
      input: {
        filter: { resolvedAddress: { _in: $owners }, isPrimary: { _eq: true } }
        blockchain: ethereum
      }
    ) {
      Domain {
        name
        owner
        resolvedAddress
      }
    }
  }
`;

export const getENSDomain = async (addresses) => {
  const variables = {
    owners: addresses, // array of addresses
  };

  try {
    const result = await request(AIRSTACK_API, getENSDomainQuery, variables, {
      headers: {
        "x-api-key": AIRSTACK_API_KEY,
      },
    });

    let arr = [];

    // console.log("result", result?.Domains?.Domain);

    addresses.map((item, index) => {
      // check on wich index the resolvedAddress is equal to the address
      const indexFound = result?.Domains?.Domain.findIndex(
        (domain) => domain?.resolvedAddress === item
      );

      // console.log("indexFound", indexFound);
      // if indexFound is not -1, it means that the address has a ENS domain
    });

    // console.log("arr", arr);

    return arr;
  } catch (error) {
    // console.log(error);
    return addresses;
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
    identities: address,
    dappName,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getSocialDetailsQuery,
      variables,
      {
        headers: {
          "x-api-key": AIRSTACK_API_KEY,
        },
      }
    );

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
};

// Top 5 Social Details

const getTop5SocialDetailsQuery = gql`
  query MyQuery($identities: [Identity!]) {
    SocialFollowers(
      input: {
        filter: {
          identity: { _in: $identities }
          dappName: { _eq: lens }
          dappSlug: { _eq: lens_v2_polygon }
          followerSince: { _lte: "2023-10-21T19:23:03Z" }
        }
        blockchain: ALL
        limit: 5
      }
    ) {
      Follower {
        followerAddress {
          socials {
            dappName
            profileName
            userAssociatedAddresses
            profileImageContentValue {
              image {
                small
              }
            }
          }
        }
      }
    }
  }
`;

export const getTop5SocialDetails = async ({ address }) => {
  console.log("getTop5SocialDetails");

  const variables = {
    identities: address,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getTop5SocialDetailsQuery,
      variables,
      {
        headers: {
          "x-api-key": AIRSTACK_API_KEY,
        },
      }
    );

    const socialDetails = result;

    if (socialDetails) {
      return socialDetails;
    }
  } catch (error) {
    console.log(error);
  }
};

// Profile Image Query

const getProfileImageQuery = gql`
  query MyQuery($identities: [Identity!]) {
    Socials(
      input: {
        filter: { dappName: { _eq: lens }, identity: { _in: $identities } }
        blockchain: ethereum
      }
    ) {
      Social {
        profileImage
        profileImageContentValue {
          image {
            extraSmall
            large
            medium
            original
            small
          }
        }
      }
    }
  }
`;

export const getProfileImage = async ({ address }) => {
  const variables = {
    identities: address,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getProfileImageQuery,
      variables,
      {
        headers: {
          "x-api-key": AIRSTACK_API_KEY,
        },
      }
    );

    const profileImage =
      result?.Socials?.Social[0]?.profileImageContentValue?.image?.small;

    if (profileImage) {
      return profileImage;
    }
  } catch (error) {
    console.log(error);
  }
};
