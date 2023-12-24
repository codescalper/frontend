import { API, api } from "../config";

export const redeemCode = async (code, address) => {
  const result = await api.post(`${API}/util/redeem-code`, {
    code: code,
    address: address,
  });

  return result.data;
};
