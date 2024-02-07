import { API, api } from "../config";

export const getFrame = async (frameId) => {
  const res = await api.get(`${API}/util/get-frame-data/${frameId}`);
  return res.data;
};

export const postFrame = async ({
  canvasId,
  metadata,
  isLike,
  isRecast,
  isFollow,
}) => {
  const res = await api.post(`${API}/util//create-frame-data`, {
    canvasId,
    metadata,
    isLike,
    isRecast,
    isFollow,
  });
  return res.data;
};

export const updateFrame = async ({
  frameId,
  imageUrl,
  tokenUri,
  minterAddress,
  txHash,
  isLike,
  isRecast,
  isFollow,
}) => {
  const res = await api.put(`${API}/util/update-frame-data`, {
    frameId,
    imageUrl,
    tokenUri,
    minterAddress,
    txHash,
    isLike,
    isRecast,
    isFollow,
  });
  return res.data;
};
