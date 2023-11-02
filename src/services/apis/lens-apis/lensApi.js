import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import { utils, ethers } from "ethers";
import { setContext } from "@apollo/client/link/context";
import omitDeep from "omit-deep";
import LENS_HUB_ABI from "../../../../ABI.json";
import request from "graphql-request";
import { ENVIRONMENT } from "../../env/env";

// export const LENS_HUB_CONTRACT = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"; // mainnet
// export const LENS_HUB_CONTRACT = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"; // mumbai
export const LENS_HUB_CONTRACT =
  ENVIRONMENT === "production"
    ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d" // mainnet
    : "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"; // mumbai
export const lensHub = new ethers.Contract(
  LENS_HUB_CONTRACT,
  LENS_HUB_ABI,
  getSigner()
);

// const API_URL = "https://api-mumbai.lens.dev";
const API_URL =
  ENVIRONMENT === "production"
    ? "https://api.lens.dev" // mainnet
    : "https://api-v2-mumbai.lens.dev"; // mumbai

// export const client = new ApolloClient({
//   uri: API_URL,
//   cache: new InMemoryCache()
// })

/* configuring Apollo GraphQL Client */
const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem("lens-auth-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: API_URL,
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

/* GraphQL queries and mutations */
export async function createPostTypedDataMutation(request, token) {
  const result = await client.mutate({
    mutation: createPostTypedData,
    variables: {
      request,
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  return result.data.createPostTypedData;
}

export async function createSetProfileImageURITypedDataMutation(
  request,
  token
) {
  const result = await client.mutate({
    mutation: CreateSetProfileImageURITypedData,
    variables: {
      request,
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  return result.data.createSetProfileImageURITypedData;
}

export const createPostTypedData = gql`
  mutation createPostTypedData($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;

export const CreateSetProfileImageURITypedData = gql`
  mutation CreateSetProfileImageURITypedData(
    $request: CreateSetProfileImageURIRequest!
  ) {
    createSetProfileImageURITypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`;

export const challenge = gql`
  query Challenge($signedBy: EvmAddress!, $for: ProfileId) {
    challenge(request: { signedBy: $signedBy, for: $for }) {
      id
      text
    }
  }
`;

export const authenticate = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

export const getDefaultProfile = gql`
  query ProfilesManaged($for: EvmAddress!) {
    profilesManaged(request: { for: $for }) {
      items {
        id
        handle {
          fullHandle
          localName
          suggestedFormatted {
            localName
          }
        }
        metadata {
          displayName
          picture {
            ... on NftImage {
              collection {
                chainId
                address
              }
              tokenId
              image {
                raw {
                  uri
                  mimeType
                }
              }
              verified
            }
            ... on ImageSet {
              raw {
                mimeType
                uri
              }
            }
            __typename
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
`;

export const validateMetadata = gql`
  query ValidatePublicationMetadata($metadatav2: PublicationMetadataV2Input!) {
    validatePublicationMetadata(request: { metadatav2: $metadatav2 }) {
      valid
      reason
    }
  }
`;

export const createSetDispatcherTypedData = gql`
  mutation CreateSetDispatcherTypedData($profileId: ProfileId!) {
    createSetDispatcherTypedData(request: { profileId: $profileId }) {
      id
      expiresAt
      typedData {
        types {
          SetDispatcherWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          dispatcher
        }
      }
    }
  }
`;

/* helper functions */
function getSigner() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return signer;
  }
  return null;
}

export const signedTypeData = (domain, types, value) => {
  const signer = getSigner();
  return signer._signTypedData(
    omit(domain, "__typename"),
    omit(types, "__typename"),
    omit(value, "__typename")
  );
};

export function omit(object, name) {
  return omitDeep(object, name);
}

export const splitSignature = (signature) => {
  return utils.splitSignature(signature);
};

export const signCreatePostTypedData = async (request, token) => {
  const result = await createPostTypedDataMutation(request, token);
  const typedData = result.typedData;
  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value
  );
  return { result, signature };
};

export const signSetProfileImageURITypedData = async (request, token) => {
  const result = await createSetProfileImageURITypedDataMutation(
    request,
    token
  );
  const typedData = result.typedData;
  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value
  );
  return { result, signature };
};

export const lensChallenge = async (address, profileId) => {
  const variables = { signedBy: address, for: profileId };
  let result = await request(API_URL, challenge, variables);
  return result;
};

export const getProfileData = async (address) => {
  const variables = { for: address };
  let result = await request(API_URL, getDefaultProfile, variables);
  return result;
};

export const createSetDispatcherTypedDataMutation = async (request) => {
  console.log("request: ", request);
  const result = await client.mutate({
    mutation: createSetDispatcherTypedData,
    variables: {
      profileId: request.profileId,
    },
  });

  return result.data.createSetDispatcherTypedData;
};

export const signSetDispatcherTypedData = async (typedData) => {
  const signature = await signedTypeData(
    typedData?.domain,
    typedData?.types,
    typedData?.value
  );

  return { typedData, signature };
};
