import axios from "axios";
import {
  BACKEND_DEV_URL,
  BACKEND_PROD_URL,
  BACKEND_LOCAL_URL,
  ENVIRONMENT,
  ALCHEMY_API,
} from "../../env/env";
import { getFromLocalStorage } from "../../../utils/localStorage";

const API =
  ENVIRONMENT === "production"
    ? BACKEND_PROD_URL
    : ENVIRONMENT === "development"
    ? BACKEND_DEV_URL
    : ENVIRONMENT === "localhost"
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

    // Add your default header here
    config.headers["Authorization"] = `Bearer ${jwtToken}`;
    config.headers["Content-Type"] = "application/json";
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] = "*";
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
    const result = await axios.post(`${API}/auth/login`, {
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
// authentication apis end

// lensauth apis start
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
// lensauth apis end

// twitter apis start
// need auth token (jwt)
export const twitterAuthenticate = async () => {
  try {
    // authenticated request
    const result = await api.get(`${API}/auth/twitter/authenticate`);

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
// twitter apis end

// twitter callback apis start
// need auth token (jwt)
export const twitterAuthenticateCallback = async (state, code) => {
  try {
    // authenticated request
    const result = await api.get(`${API}/auth/twitter/callback`, {
      params: {
        state: state,
        code: code,
      },
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
// twitter callback apis end

// NFT apis start
// upload users' nft endpoint
// need auth token (jwt)
export const refreshNFT = async () => {
  const result = await api.post(`${API}/user/nft/update`);
  return result?.data;
};

// gwt users' nft endpoint
// need auth token (jwt)
export const getNFTs = async (query, page) => {
  const result = await api.get(`${API}/user/nft?query=${query}`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// search users' nft by id endpoint
// need auth token (jwt)
export const getNftById = async (id) => {
  const result = await api.get(`${API}/user/nft/${id}`);
  return result?.data;
};
// NFT apis end

// canvas apis satrt
// craete canvas endpoint
// need auth token (jwt)
export const createCanvas = async ({ data, referredFrom, preview }) => {
  const result = await api.post(`${API}/user/canvas/create`, {
    canvasData: {
      data: data,
      referredFrom: referredFrom,
    },
    preview: preview,
  });

  return result?.data;
};

// update current canvas endpoint
// need auth token (jwt)
export const updateCanvas = async ({
  id,
  data,
  referredFrom,
  isPublic,
  preview,
}) => {
  const result = await api.put(`${API}/user/canvas/update`, {
    canvasData: {
      id: id,
      data: data,
      isPublic: isPublic,
      referredFrom: referredFrom,
    },
    preview: preview,
  });

  return result?.data;
};

// change canvas visibility endpoint
// need auth token (jwt)
export const changeCanvasVisibility = async ({ id, isPublic }) => {
  const result = await api.put(`${API}/user/canvas/visibility`, {
    canvasData: {
      id: id,
      isPublic: isPublic,
    },
  });
  return result?.data;
};

// get all canvas endpoint
// need auth token (jwt)
export const getAllCanvas = async () => {
  const result = await api.get(`${API}/user/canvas?limit=50&offset=0`);
  return result?.data;
};

// get canvas by id endpoint
// need auth token (jwt)
export const getCanvasById = async (id) => {
  const result = await api.get(`${API}/user/canvas/${id}`);
  return result?.data;
};

// delete canvas by id endpoint
// need auth token (jwt)
export const deleteCanvasById = async (id) => {
  const result = await api.delete(`${API}/user/canvas/delete/${id}`);
  return result?.data;
};

export const tokengateCanvasById = async ({ id, gatewith }) => {
  const result = await api.post(`${API}/user/canvas/gate/${id}`, {
    gatewith: gatewith,
  });

  return result?.data;
};

// share canvas on lens endpoint
// need auth token (jwt)
export const shareOnSocials = async ({
  canvasData,
  canvasParams,
  platform,
  timeStamp,
}) => {
  const result = await api.post(`${API}/user/canvas/publish`, {
    canvasData: canvasData,
    canvasParams: canvasParams,
    platform: platform,
    timeStamp: timeStamp,
  });

  return result?.data;
};
// canvas apis end

// collection apis start
// get all collection endpoint
// need auth token (jwt)
export const getAllCollection = async (page) => {
  const result = await api.get(`${API}/collection`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// get nfts of a collection endpoint
// need auth token (jwt)
export const getNftByCollection = async (contractAddress, page) => {
  const result = await api.get(`${API}/collection/${contractAddress}`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// search a NFT of a collection endpoint
// need auth token (jwt)
export const getCollectionNftById = async (id, contractAddress) => {
  const result = await api.get(`${API}/collection/${contractAddress}/${id}`);
  return result?.data;
};
// collection apis start

// utils apis
export const checkDispatcher = async () => {
  try {
    const result = await api.get(`${API}/util/check-dispatcher`);

    if (result?.status === 200) {
      if (result?.data?.status === "success") {
        return {
          message: result?.data?.message,
          profileId: result?.data?.profileId,
        };
      }
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

export const setDispatcher = async () => {
  try {
    const result = await api.get(`${API}/auth/lens/set-dispatcher`);

    return result?.data?.message;
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

// template apis start
// no need auth token (jwt)
export const getAllTemplates = async (page) => {
  const result = await api.get(`${API}/template`, {
    params: {
      limit: 20,
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};
// template apis end

// user public templates apis start
export const getUserPublicTemplates = async (page) => {
  const result = await api.get(`${API}/template/user`, {
    params: {
      limit: 20,
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};
// user public templates apis end

// asset apis start
// need auth token (jwt)
export const getAssetByQuery = async (query, page) => {
  const result = await api.get(`${API}/asset/?query=${query}`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};
// asset apis end

// BG asset apis start
// need auth token (jwt)
export const getBGAssetByQuery = async (query, page) => {
  const result = await api.get(`${API}/asset/background?author=${query}`, {
    params: {
      page: page,
    },
  });
  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// Remove Background API
export const getRemovedBgS3Link = async (query) => {
  try {
    const result = await api.post(
      `${API}/util/remove-bg?image=${encodeURIComponent(query)}`
    );

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

// user is holder of collection apis start
export const getIsUserWhitelisted = async (walletAddress) => {
  const result = await api.get(
    `${API}/util/whitelisted?wallet=${walletAddress}`
  );

  if (result?.data?.status === "success") {
    return {
      data: result?.data?.message,
    };
  }
};
// user is holder of collection apis end

// upload section apis start

// upload user assets endpoint
export const uploadUserAssets = async (image) => {
  const result = await api.post(`${API}/user/upload`, {
    image: image,
  });

  return result?.data;
};

// get user assets endpoint
export const getUserAssets = async (page) => {
  const result = await api.get(`${API}/user/upload`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// delete user assets endpoint
export const deleteUserAsset = async (id) => {
  const result = await api.delete(`${API}/user/upload/${id}`);

  return result?.data;
};
// upload section end
