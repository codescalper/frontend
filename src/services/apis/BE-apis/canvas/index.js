import { API, api } from "../config";

export const mintToXchain = async ({ canvasId, mintLink, platform, chain }) => {
  const result = await api.post(`${API}/user/canvas/minted`, {
    canvasId,
    mintLink,
    platform,
    chain,
  });

  return result?.data;
};
