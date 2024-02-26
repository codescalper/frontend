import { API, api } from "../config";

export const getFrame = async (frameId) => {
  const res = await api.get(`${API}/util/get-frame-data/${frameId}`);
  return res.data;
};

export const postFrame = async ({
  canvasId,
  owner,
  isTopUp,
  allowedMints,
  metadata,
  isLike,
  isRecast,
  isFollow,
  redirectLink,
}) => {
  const res = await api.post(`${API}/util//create-frame-data`, {
    canvasId,
    owner,
    isTopUp,
    allowedMints,
    metadata,
    isLike,
    isRecast,
    isFollow,
    redirectLink,
  });
  return res.data;
};

export const getOrCreateWallet = async (address) => {
  const res = await api.get(`${API}/mint`, {
    address,
  });
  return res.data;
};

export const withdrawFunds = async ({ address, amount }) => {
  const res = await api.post(`${API}/mint/withdraw`, {
    to: address,
    amount: amount,
  });
  return res.data;
};
