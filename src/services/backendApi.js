import axios from "axios";
import {
  BACKEND_DEV_URL,
  BACKEND_PROD_URL,
  BACKEND_LOCAL_URL,
  ENVIRONMENT,
} from "./env";
import { getFromLocalStorage } from "./localStorage";

const API =
  ENVIRONMENT === "production"
    ? BACKEND_PROD_URL
    : ENVIRONMENT === "staging"
    ? BACKEND_DEV_URL
    : ENVIRONMENT === "development"
    ? BACKEND_LOCAL_URL
    : BACKEND_LOCAL_URL;

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
    const jwtToken = getFromLocalStorage("userAuthToken");

    // Exclude the login API from adding the default header
    if (config.url !== "/auth/login" || config.url !== "/template") {
      // Add your default header here
      config.headers["Authorization"] = `Bearer ${jwtToken}`;
      config.headers["Content-Type"] = "application/json";
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Methods"] = "*";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// authentication apis start
// no need auth token (jwt)
export const login = async (walletAddress, signature, message) => {
  try {
    const result = await api.post(`${API}/auth/login`, {
      address: walletAddress,
      signature: signature,
      message: message,
    });

    if (result?.status === 200) {
      if (result?.data?.status === "success") {
        return {
          data: result?.data?.jwt,
        };
      } else if (result?.data?.status === "failed") {
        return {
          error: result?.data?.message,
        };
      }
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// need auth token (jwt)
export const lensAuthenticate = async (signature) => {
  try {
    const result = await api.post(`${API}/auth/lens/authenticate`, {
      signature: signature,
    });

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 400) {
      console.log({ 400: error?.response?.data?.message });
      return {
        error: error?.response?.statusText,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// need auth token (jwt)
export const twitterAuthenticate = async () => {
  try {
    const result = await api.get(`${API}/auth/twitter/authenticate`);

    console.log("result", result);

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 400) {
      console.log({ 400: error?.response?.data?.message });
      return {
        error: error?.response?.statusText,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// need auth token (jwt)
export const twitterAuthenticateCallback = async (state, code) => {
  try {
    const result = await api.get(
      `${API}/auth/twitter/callback?state=${state}&code=${code}`
    );

    console.log("result", result);

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 400) {
      console.log({ 400: error?.response?.data?.message });
      return {
        error: error?.response?.statusText,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};
// authentication apis end

// NFT apis start
// need auth token (jwt)
export const refreshNFT = async () => {
  const result = await api.post(`${API}/user/nft/update`);
  return result?.data;
};

// need auth token (jwt)
export const getNFTs = async () => {
  const result = await api.get(`${API}/user/nft/owned?limit=100&offset=0`);
  return result?.data;
};

// need auth token (jwt)
export const getNftById = async (id) => {
  const result = await api.get(`${API}/user/nft/${id}`);
  return result?.data;
};
// NFT apis end

// canvas apis satrt
// need auth token (jwt)
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

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else if (result?.status === 404) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message ||
          error?.response?.data?.name ||
          error?.response?.data,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// need auth token (jwt)
export const updateCanvas = async (
  id,
  jsonCanvasData,
  followCollectModule,
  isPublic
) => {
  try {
    const result = await api.put(`${API}/user/canvas/update`, {
      canvasData: {
        id: id,
        data: jsonCanvasData,
        params: {
          followCollectModule: followCollectModule,
        },
        isPublic: isPublic,
      },
    });

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else if (result?.status === 404) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message ||
          error?.response?.data?.name ||
          error?.response?.data,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// need auth token (jwt)
export const changeCanvasVisibility = async (id, isPublic) => {
  try {
    const result = await api.put(`${API}/user/canvas/visibility`, {
      canvasData: {
        id: id,
        isPublic: isPublic,
      },
    });

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else if (result?.status === 404) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 401) {
      return {
        error: error?.response?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// need auth token (jwt)
export const getAllCanvas = async () => {
  const result = await api.get(`${API}/user/canvas?limit=100&offset=0`);
  return result?.data;
};

// need auth token (jwt)
export const getCanvasById = async (id) => {
  try {
    const result = await api.get(`${API}/user/canvas/${id}`);

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else if (result?.status === 404) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// need auth token (jwt)
export const deleteCanvasById = async (id) => {
  const result = await api.delete(`${API}/user/canvas/delete/${id}`);
  return result?.data;
};

export const shareOnLens = async (canvasId, name, content) => {
  try {
    const result = await api.post(`${API}/user/canvas/publish`, {
      canvasData: {
        id: canvasId,
        name: name,
        content: content,
      },
      platform: "lens",
    });

    console.log("result", result);

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else if (result?.status === 404) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};
// canvas apis end

// collection apis start
// need auth token (jwt)
export const getAllCollection = async () => {
  const result = await api.get(`${API}/collection`);
  return result?.data;
};

// need auth token (jwt)
export const getNftByCollection = async (contractAddress) => {
  const result = await api.get(
    `${API}/collection/${contractAddress}?limit=100&offset=0`
  );
  return result?.data;
};

// need auth token (jwt)
export const getCollectionNftById = async (id, contractAddress) => {
  const result = await api.get(`${API}/collection/${contractAddress}/${id}`);
  return result?.data;
};
// collection apis start

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

// template apis start
// no need auth token (jwt)
export const getAllTemplates = async () => {
  const result = await api.get(`${API}/template`);
  return result?.data;
};
// template apis end

// user public templates apis start
export const getUserPublicTemplates = async () => {
  const result = await api.get(`${API}/template/user`);
  return result?.data;
};

// user public templates apis end

// asset apis start
// need auth token (jwt)
export const getAssetByQuery = async (query) => {
  const result = await api.get(
    `${API}/asset/?query=${query}&limit=100&offset=0`
  );
  return result?.data;
};

// asset apis end

// BG asset apis start
// need auth token (jwt)
export const getBGAssetByQuery = async (query) => {
  const result = await api.get(
    `${API}/asset/background?author=${query}&limit=100&offset=0`
  );
  return result?.data;
};

// Remove Background API

export const getRemovedBgS3Link = async (query) => {
  try {
    const result = await api.post(`${API}/util/upload-image?image=${query}`);

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 401) {
      console.log({ 401: error?.response?.statusText });
      return {
        error: error?.response?.data?.message,
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};
