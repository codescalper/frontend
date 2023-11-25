import { gql } from "@apollo/client";
import request from "graphql-request";
import { AIRSTACK_API_KEY } from "../../env/env";

export const AIRSTACK_API = "https://api.airstack.xyz/gql";

export const getENSDomainQuery = gql`
  query MyQuery($owner: Identity!) {
    Domains(
      input: { filter: { owner: { _eq: $owner } }, blockchain: ethereum }
    ) {
      Domain {
        isPrimary
        name
      }
    }
  }
`;

export const getENSDomain = async (address) => {
  const variables = {
    owner: address,
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
    console.log(error);
    return address;
  }
};
