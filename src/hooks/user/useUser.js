import { useQuery } from "@tanstack/react-query";
import { useAppAuth, useLocalStorage } from "../app";
import { getUserProfile } from "../../services/apis/BE-apis";
import { getProfileImage } from "../../services";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useUser = () => {
  const [profileImage, setProfileImage] = useState(null);
  const { userId } = useLocalStorage();
  const { address } = useAccount();
  const { isAuthenticated } = useAppAuth();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["user", { userId }],
    queryFn: getUserProfile,
    enabled: isAuthenticated ? true : false,
    refetchOnMount: false,
  });

  const res = async () => {
    const data = await getProfileImage(address);
    setProfileImage(data);
  };

  useEffect(() => {
    res();
  }, [address]);

  return {
    username: data?.message?.username,
    email: data?.message?.mail,
    lensHandle: data?.message?.lens_handle,
    points: data?.message?.points,
    profileImage: profileImage,
    error,
    isError,
    isLoading,
  };
};

export default useUser;
