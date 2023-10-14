import { useState } from "react";

// Custom hook for error handling
const useSolanaWalletError = () => {
  const [error, setError] = useState({
    isError: false,
    name: "",
    message: "",
  });

  const onSolanaWalletError = (isError, name, message) => {
    setError({
      isError: isError,
      name: name,
      message: message,
    });
  };

  return { solanaWalletError: error, onSolanaWalletError };
};

export default useSolanaWalletError;
