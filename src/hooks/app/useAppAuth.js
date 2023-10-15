const useAppAuth = () => {
  const isAuthenticated = localStorage.getItem("userAuthToken");
  return { isAuthenticated };
};

export default useAppAuth;
