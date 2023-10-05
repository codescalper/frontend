import { removeFromLocalStorage } from "./localStorage";

// remove all data from localstorage

export const clearAllLocalStorageData = () => {
  removeFromLocalStorage("userAuthToken");
  removeFromLocalStorage("usertAuthTmestamp");
  removeFromLocalStorage("userAddress");
  removeFromLocalStorage("lensAuth");
  removeFromLocalStorage("ifUserEligible");
  removeFromLocalStorage("dispatcher");
};
