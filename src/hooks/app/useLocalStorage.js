import { LOCAL_STORAGE } from "../../data";

// hook for local storage to retrieve the data
const useLocalStorage = () => {
  const getFromLocalStorage = (key) => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) return undefined;
      return JSON.parse(serializedValue);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };

  const authToken = getFromLocalStorage(LOCAL_STORAGE.authToken);
  const evmAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const solanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const loggedInUserAddress = getFromLocalStorage(LOCAL_STORAGE.userAddress);
  const userAuthTime = getFromLocalStorage(LOCAL_STORAGE.userAuthTime);
  const lensAuth = getFromLocalStorage(LOCAL_STORAGE.lensAuth);
  const ifUserEligible = getFromLocalStorage(LOCAL_STORAGE.ifUserEligible);
  const hasUserSeenTheApp = getFromLocalStorage(
    LOCAL_STORAGE.hasUserSeenTheApp
  );
  const dispatcher = getFromLocalStorage(LOCAL_STORAGE.dispatcher);
  const userGuideTour = getFromLocalStorage(LOCAL_STORAGE.userGuideTour);
  const braveShieldWarn = getFromLocalStorage(LOCAL_STORAGE.braveShieldWarn);
  const userId = getFromLocalStorage(LOCAL_STORAGE.userId);

  return {
    authToken,
    evmAuth,
    solanaAuth,
    loggedInUserAddress,
    userAuthTime,
    lensAuth,
    ifUserEligible,
    hasUserSeenTheApp,
    dispatcher,
    userGuideTour,
    braveShieldWarn,
    userId,
  };
};

export default useLocalStorage;
