import { Store } from "polotno/model/store";
import { BACKEND_DEV_URL, BACKEND_PROD_URL, BACKEND_LOCAL_URL } from "./env";
import axios, { all } from "axios";
import { getFromLocalStorage } from "./localStorage";

const API = BACKEND_DEV_URL;

/**
 * @param walletAddress string
 * @param jsonCanvasData object
 * @param params object
 * @param isPublic boolean
 * @param id number
 * @param visibility string
 * @param contractAddress string
 * @param store store object
 */

// add default header (autherization and content type) in axios for all the calls except login api
// Create an instance of Axios
const api = axios.create();

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const jwtToken = getFromLocalStorage("jwt");

    // Exclude the login API from adding the default header
    if (config.url !== "/auth/login") {
      // Add your default header here
      config.headers["Authorization"] = `Bearer ${jwtToken}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// test apis
// export const test = async () => {
//   try {
//     const result = await api.get(`${API}/test`);

//     console.log("result", result);
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// authentication apis
export const login = async (walletAddress, signature, message) => {
  if (!walletAddress || !signature || !message)
    return console.log("missing params");

  try {
    const result = await api.post(`${API}/auth/login`, {
      address: walletAddress,
      signature: signature,
      message: message,
    });

    return result.data;
  } catch (error) {
    return error;
  }
};

// export const getChallenge = async (walletAddress) => {
//   if (!walletAddress) return console.log("missing walletAddress");

//   try {
//     const result = await api.get(`${API}/auth/lens/challenge`, {
//       address: walletAddress,
//     });

//     console.log("result", result);
//     return result.data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

export const authenticate = async (walletAddress, signature) => {
  try {
    const result = await api.post(`${API}/auth/lens/authenticate`, {
      address: walletAddress,
      signature: signature,
    });

    return result.data;
  } catch (error) {
    return error;
  }
};

// NFT apis
export const refreshNFT = async (walletAddress) => {
  if (!walletAddress) return console.log("missing walletAddress");

  try {
    const result = await api.post(`${API}/user/nft/update`, {
      address: walletAddress,
    });

    return result.data;
  } catch (error) {
    return error;
  }
};

export const getNFTs = async (walletAddress) => {
  if (!walletAddress) return console.log("missing walletAddress");

  try {
    const result = await api.get(`${API}/user/nft/owned`, {
      address: walletAddress,
    });

    return result.data;
  } catch (error) {
    return error;
  }
};

export const getNftById = async (id) => {
  if (!id) return console.log("missing id");

  try {
    const result = await api.get(`${API}/user/nft/${id}`);

    return result.data;
  } catch (error) {
    return error;
  }
};

// canvas apis
export const createCanvas = async (
  jsonCanvasData,
  followCollectModule,
  isPublic
) => {
  try {
    const result = await api.post(`${API}/user/canvas/create`, {
      canvasData: {
        data: jsonCanvasData,
        params: {
          followCollectModule: followCollectModule,
        },
        isPublic: isPublic,
      },
    });

    return result.data;
  } catch (error) {
    return error;
  }
};

// export const updateCanvas = async (id, jsonCanvasData, params, isPublic) => {
//   if (!data || !params || !isPublic) return console.log("missing params");

//   try {
//     const result = await axios.put(`${API}/user/canvas/update`, {
//       canvasData: {
//         id: id,
//         data: jsonCanvasData,
//         params: params,
//         isPublic: isPublic,
//       },
//     });

//     console.log("result", result);
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const changeCanvasVisibility = async (id, visibility) => {
//   if (!id || !visibility) return console.log("missing params");

//   try {
//     const result = await axios.put(`${API}/user/canvas/visibility`, {
//       canvasData: {
//         id: id,
//         visibility: visibility,
//       },
//     });

//     console.log("result", result);
//   } catch (error) {
//     console.log("error", error);
//   }
// };

export const getCanvasById = async (id) => {
  try {
    const result = await api.get(`${API}/user/canvas/${id}`);

    return result.data;
  } catch (error) {
    return error;
  }
};

export const deleteCanvasById = async (id) => {

  try {
    const result = await api.delete(`${API}/user/canvas/delete/${id}`);

    return result.data;
  } catch (error) {
    return error;
  }
};

// export const publishCanvasToLens = async (id, name, content) => {
//   if (!id || !name || !content) return console.log("missing params");

//   try {
//     const result = await axios.post(`${API}/user/canvas/publish`, {
//       id,
//       name,
//       content,
//     });

//     console.log("result", result);
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// collection apis
export const getAllCollection = async () => {
  try {
    const result = await api.get(`${API}/collection`);

    return result.data;
  } catch (error) {
    return error;
  }
};

export const getNftByCollection = async (contractAddress) => {
  if (!contractAddress) return console.log("missing contractAddress");

  try {
    const result = await api.get(
      `${API}/collection/${contractAddress}?limit=100&offset=200`
    );

    return result.data;
  } catch (error) {
    return error;
  }
};

export const getCollectionNftById = async (id, contractAddress) => {
  if (!id || !contractAddress) return console.log("missing params");

  try {
    const result = await api.get(`${API}/collection/${contractAddress}/${id}`);
    return result.data;
  } catch (error) {
    console.log("error", error);
  }
};

// utils apis
// export const checkDispatcher = async (profileId) => {
//   if (!profileId) return console.log("missing profileId");

//   try {
//     const result = await axios.get(`${API}/util/checkDispatcher`, {
//       profileId,
//     });

//     console.log("result", result);
//     return result.data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// template apis
export const getAllTemplates = async () => {
  try {
    const result = await api.get(`${API}/template`);

    return result.data;
  } catch (error) {
    console.log("error", error);
    alert("error", error);
  }
};
