import { Store } from "polotno/model/store";
import { BACKEND_DEV_URL, BACKEND_PROD_URL, BACKEND_LOCAL_URL } from "./env";
import axios, { all } from "axios";
import { getFromLocalStorage } from "./localStorage";
import { toast } from "react-hot-toast";

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
// no need auth token (jwt)
export const login = async (walletAddress, signature, message) => {
  if (!walletAddress || !signature || !message) return;

  try {
    const result = await api.post(`${API}/auth/login`, {
      address: walletAddress,
      signature: signature,
      message: message,
    });

    if (result.status === 200) {
      if (result.data.status === "success") {
        toast.success("Login successful");
        return result.data;
      } else if (result.data.status === "failed") {
        return toast.error(result.data.message);
      }
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
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

// need auth token (jwt)
export const authenticate = async (walletAddress, signature) => {
  if (!walletAddress || !signature) return;

  try {
    const result = await api.post(`${API}/auth/lens/authenticate`, {
      address: walletAddress,
      signature: signature,
    });

    if (result.status === 200) {
      toast.success("Authentication successful");
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// NFT apis
// need auth token (jwt)
export const refreshNFT = async (walletAddress) => {
  if (!walletAddress) return;

  try {
    const result = await api.post(`${API}/user/nft/update`, {
      address: walletAddress,
    });

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const getNFTs = async (walletAddress) => {
  if (!walletAddress) return;

  try {
    const result = await api.get(`${API}/user/nft/owned`, {
      address: walletAddress,
    });

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const getNftById = async (id, walletAddress) => {
  if (!id || !walletAddress) return;

  try {
    const result = await api.get(`${API}/user/nft/${id}`);

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// canvas apis
// need auth token (jwt)
export const createCanvas = async (
  jsonCanvasData,
  followCollectModule,
  isPublic,
  walletAddress
) => {
  if (!walletAddress) return;

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

    // if (result.status === 200) {
    //   return result.data;
    // } else if (result.status === 400) {
    //   return toast.error(result.data.message);
    // } else if (result.status === 500) {
    //   return toast.error(result.data.message);
    // } else if (result.status === 401) {
    //   return toast.error(result.data.message);
    // }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const updateCanvas = async (
  id,
  jsonCanvasData,
  followCollectModule,
  isPublic,
  walletAddress
) => {
  if (!walletAddress) return;

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

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
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

// need auth token (jwt)
export const getAllCanvas = async (walletAddress) => {
  if (!walletAddress) return;

  try {
    const result = await api.get(`${API}/user/canvas`);

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const getCanvasById = async (id, walletAddress) => {
  if (!id || !walletAddress) return;

  try {
    const result = await api.get(`${API}/user/canvas/${id}`);

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const deleteCanvasById = async (id, walletAddress) => {
  if (!id || !walletAddress) return;

  try {
    const result = await api.delete(`${API}/user/canvas/delete/${id}`);

    if (result.status === 200) {
      result.data;
      return toast.success(result.data.message);
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
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
// need auth token (jwt)
export const getAllCollection = async (walletAddress) => {
  if (!walletAddress) return;

  try {
    const result = await api.get(`${API}/collection`);

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const getNftByCollection = async (contractAddress, walletAddress) => {
  if (!contractAddress || !walletAddress) return;

  try {
    const result = await api.get(
      `${API}/collection/${contractAddress}?limit=100&offset=200`
    );

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const getCollectionNftById = async (
  id,
  contractAddress,
  walletAddress
) => {
  if (!id || !contractAddress || !walletAddress) return;

  try {
    const result = await api.get(`${API}/collection/${contractAddress}/${id}`);

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
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
// no need auth token (jwt)
export const getAllTemplates = async () => {

  try {
    const result = await api.get(`${API}/template`);

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};

// need auth token (jwt)
export const twitterAuth = async (walletAddress) => {
  if (!walletAddress) return;

  try {
    const result = await api.get(`${API}/auth/twitter/authenticate`);

    if (result.status === 200) {
      return result.data;
    } else if (result.status === 400) {
      return toast.error(result.data.message);
    } else if (result.status === 500) {
      return toast.error(result.data.message);
    } else if (result.status === 401) {
      return toast.error(result.data.message);
    }
  } catch (error) {
    // code 404
    return toast.error("Something went wrong, please try again later");
  }
};
