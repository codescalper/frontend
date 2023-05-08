import { Store } from "polotno/model/store";
import { BACKEND_DEV_URL, BACKEND_PROD_URL } from "./env";
import axios from "axios";

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

// authentication apis
export const login = async (walletAddress, singnature) => {
  if (!walletAddress || !singnature || !messege)
    return console.log("missing params");

  try {
    const result = await axios.post(`${API}/auth/login`, {
      address: walletAddress,
      signature: singnature,
      message: "This message is to login you into lenspost dapp.",
    });

    console.log("result", result);
  } catch (error) {
    console.log("error", error);
  }
};

// NFT apis
export const refreshNFT = async (walletAddress) => {
  if (!walletAddress) return console.log("missing walletAddress");

  try {
    const result = await axios.post(`${API}/user/nft/update`, {
      walletAddress,
    });

    console.log("result", result);
  } catch (error) {
    console.log("error", error);
  }
};

export const getNFTs = async (walletAddress) => {
  if (!walletAddress) return console.log("missing walletAddress");

  try {
    const result = await axios.get(`${API}/user/nft/owned`, {
      walletAddress,
    });

    console.log("result", result);
    return result.data;
  } catch (error) {
    console.log("error", error);
  }
};

// canvas apis
export const createCanvas = async (jsonCanvasData, params, isPublic) => {
  if (!data || !params || !isPublic) return console.log("missing params");

  try {
    const result = await axios.post(`${API}/user/canvas/create`, {
      canvasData: {
        data: jsonCanvasData,
        params: params,
        isPublic: isPublic,
      },
    });

    console.log("result", result);
  } catch (error) {
    console.log("error", error);
  }
};

export const updateCanvas = async (id, jsonCanvasData, params, isPublic) => {
  if (!data || !params || !isPublic) return console.log("missing params");

  try {
    const result = await axios.put(`${API}/user/canvas/update`, {
      canvasData: {
        id: id,
        data: jsonCanvasData,
        params: params,
        isPublic: isPublic,
      },
    });

    console.log("result", result);
  } catch (error) {
    console.log("error", error);
  }
};

export const changeCanvasVisibility = async (id, visibility) => {
  if (!id || !visibility) return console.log("missing params");

  try {
    const result = await axios.put(`${API}/user/canvas/visibility`, {
      canvasData: {
        id: id,
        visibility: visibility,
      },
    });

    console.log("result", result);
  } catch (error) {
    console.log("error", error);
  }
};

export const getCanvasById = async (id) => {
  if (!id) return console.log("missing id");

  try {
    const result = await axios.get(`${API}/user/canvas/get${id}`);

    console.log("result", result);
    return result.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const publishCanvasToLens = async (id, name, content) => {
  if (!id || !name || !content) return console.log("missing params");

  try {
    const result = await axios.post(`${API}/user/canvas/publish`, {
      id,
      name,
      content,
    });

    console.log("result", result);
  } catch (error) {
    console.log("error", error);
  }
};

// collection apis
export const getAllCollection = async () => {
  try {
    const result = await axios.get(`${API}/collection`);

    console.log("result", result);
    return result.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getNftByCollection = async (contractAddress) => {
  if (!contractAddress) return console.log("missing contractAddress");

  try {
    const result = await axios.get(
      `${API}/collection/${contractAddress}?limit=100&offset=200`
    );

    console.log("result", result);
    return result.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getNftById = async (id, contractAddress) => {
  if (!id || !contractAddress) return console.log("missing params");

  try {
    const result = await axios.get(
      `${API}/collection/${contractAddress}/${id}`
    );

    console.log("result", result);
    return result.data;
  } catch (error) {
    console.log("error", error);
  }
};

// utils apis
export const checkDispatcher = async (profileId) => {
  if (!profileId) return console.log("missing profileId");

  try {
    const result = await axios.get(`${API}/util/checkDispatcher`, {
      profileId,
    });

    console.log("result", result);
    return result.data;
  } catch (error) {
    console.log("error", error);
  }
};
