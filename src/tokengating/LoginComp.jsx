import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { isHolderOfCollection } from "../services/backendApi";
import { useContext, useEffect, useRef, useState } from "react";
import { whitelistAddresses } from "../utility/whitelistAddresses";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../services/localStorage";
import { toast } from "react-toastify";
import { fnMessage } from "../services/fnMessage";
import { useNavigate } from "react-router-dom";

const LoginComp = () => {
  const getHasUserSeenTheApp = getFromLocalStorage("hasUserSeenTheApp");
  const getifUserEligible = getFromLocalStorage("ifUserEligible");
  const contractAddress = "0x3Fe1a4c1481c8351E91B64D5c398b159dE07cbc5"; // Supducks contract address
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isUserEligible, setIsUserEligible] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["isHolderOfCollection"],
    queryFn: () => isHolderOfCollection(address, contractAddress),
    enabled: address ? true : false,
  });

  const isUserEligibleFn = () => {
    if (
      getifUserEligible &&
      getifUserEligible.address === address &&
      getifUserEligible.isUserEligible === true
    ) {
      return true;
    } else if (getHasUserSeenTheApp && getHasUserSeenTheApp === true) {
      return true;
    } else {
      return false;
    }
  };

  const ifUserEligible = () => {
    if (data?.isHolderOfCollection === true) {
      setIsUserEligible(true);

      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
        confettiNumber: 100,
      });
      // user is whitelisted
      // store the address in local storage
      saveToLocalStorage("ifUserEligible", {
        address: address,
        isUserEligible: true,
      });

      // redirect to the app
    } else if (data?.isHolderOfCollection === false) {
      // user is not eligible
      const isWhitelisted = whitelistAddresses.includes(address);
      if (isWhitelisted) {
        setIsUserEligible(true);

        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
          emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
          confettiNumber: 100,
        });
        // user is whitelisted
        // store the address in local storage
        saveToLocalStorage("ifUserEligible", {
          address: address,
          isUserEligible: true,
        });

        // redirect to the app
        // setTimeout(() => {
        //   return navigate("/");
        // }, 5000);
      } else {
        // user is not whitelisted
        // keep showing the login page
        setIsUserEligible(false);
      }
    }
  };

  useEffect(() => {
    // if false redirect to ifUserEligible page
    if (isUserEligibleFn()) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    ifUserEligible();
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(fnMessage(error));
      console.log(error?.message);
    }
  }, [isError]);

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ background: "linear-gradient(90deg, #E598D8 0%, #E1F16B 100%)" }}
    >
      <div className="w-1/2">
        <div className="flex flex-col align-middle justify-between m-2 p-2">
          <div className="flex flex-col justify-center align-middle text-center flex-wrap m-4 rounded-md">
            <div className="m-2 text-lg">
              {" "}
              <img
                className="h-16"
                src="/LenspostAlphaLogoRemovedBG.png"
                alt=""
              />{" "}
            </div>
            {/* if wallet is disconnected */}
            {!address && (
              <div className="m-2 text-lg">
                {" "}
                Step into a world of endless possibilities! Connect your wallet
                now to unlock exclusive access and discover if you're eligible
                for an extraordinary app experience.{" "}
              </div>
            )}

            {/* if wallet if connected but not eligible */}
            {!isUserEligible && address && (
              <>
                <h1
                  className="text-3xl font-bold line"
                  style={{
                    letterSpacing: "0.1em",
                  }}
                >
                  {!isLoading && "Oops! 🥲"}
                </h1>
                {isLoading ? (
                  <div className="m-2 text-lg italic">
                    {" "}
                    Checking your eligibility...{" "}
                  </div>
                ) : (
                  <div className="m-2 text-lg">
                    {" "}
                    While you're not eligible this time, your support and
                    participation mean the world to us. Stay tuned for more
                    amazing opportunities and thank you for being part of our
                    community.{" "}
                  </div>
                )}
              </>
            )}

            {/* if wallet if connected and eligible */}
            {isUserEligible && address && (
              <>
                <h1
                  className="text-3xl font-bold line"
                  style={{
                    letterSpacing: "0.1em",
                  }}
                >
                  {!isLoading && "Congratulations! 🥳"}
                </h1>
                {isLoading ? (
                  <div className="m-2 text-lg italic">
                    {" "}
                    Checking your eligibility...{" "}
                  </div>
                ) : (
                  <>
                    <div className="m-2 text-lg">
                      {" "}
                      You've just unlocked a world of extraordinary
                      possibilities. Get ready to embark on an exciting journey
                      like no other!{" "}
                    </div>
                  </>
                )}
              </>
            )}

            {/* {if wallet is connected but not eligible} */}
            {address && !isUserEligible && (
              <div className="mb-2 p-2 flex flex-row justify-center">
                {<ConnectButton />}
              </div>
            )}

            {/* if disconnected */}
            {!address && (
              <div className="mb-2 p-2 flex flex-row justify-center">
                {<ConnectButton />}
              </div>
            )}

            {isUserEligible && address && !isLoading && (
              <div className="mb-2 p-2 flex flex-row justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="bg-blue-500 py-3 px-5 rounded-lg text-white"
                >
                  Lunch App
                </button>
              </div>
            )}

            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginComp;

// test supducks holder address = 0xa6bcB89f21E0BF71E08dEd426C142757791e17cf
