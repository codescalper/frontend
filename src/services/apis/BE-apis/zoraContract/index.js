import { API, api } from "../config";

export const deployZoraContract = async ({
  contract_type,
  canvasId,
  chainId,
  args,
}) => {
  const res = await api.post(`${API}/mint/deploy-contract`, {
    contract_type,
    canvasId,
    chainId,
    args,
  });
  return res.data;
};
