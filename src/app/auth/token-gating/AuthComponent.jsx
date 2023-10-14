import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getIsUserWhitelisted } from "../../../services";
import { errorMessage, getFromLocalStorage, saveToLocalStorage } from "../../../utils";
 
const AuthComponent = () => {
  const getHasUserSeenTheApp = getFromLocalStorage("hasUserSeenTheApp");
  const getifUserEligible = getFromLocalStorage("ifUserEligible");
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isUserEligible, setIsUserEligible] = useState(false); 
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["isHolderOfCollection"],
    queryFn: () => getIsUserWhitelisted(address),
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
    if (data?.data) {
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
    } else {
      // user is not whitelisted
      // keep showing the login page
      setIsUserEligible(false);
    }
  };

  useEffect(() => {
    // if true redirect to home page
    if (isUserEligibleFn()) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    ifUserEligible();
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage(error));
    }
  }, [isError]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div
        className="flex justify-center items-center h-screen"
        style={{
          background: "linear-gradient(90deg, #E598D8 10%, #E1F16B 100%)",
        }}
      >
        <div className="w-full md:w-3/4 lg:w-1/2">
          <div className="flex flex-col justify-between m-2 p-2">
            <div className="flex flex-col justify-center text-center flex-wrap m-4 rounded-md">
              <div className="m-2 text-lg">
                {" "}
                <img
                  className="h-16 mb-8"
                  src="/LenspostAlphaLogoRemovedBG.png"
                  alt=""
                />{" "}
              </div>
              {/* if wallet is disconnected */}
              {!address && (
                <div className="m-2 text-lg">
                  {" "}
                  Welcome to the future of creating DOPE content with your
                  collectibles!
                  <br /> Word on the street is we’re THE WEB
                  <span className="text-xl">3 </span> Canva killer ;){" "}
                </div>
              )}

              {/* if wallet is connected but not eligible */}
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
                    <div className="flex flex-col text-center align-middle justify-center m-2 text-lg">
                      <div>
                        {/* Opps! */}
                        Looks like you’re not eligible at this time!
                        <br /> Sign up for the waitlist and we’ll hook you up
                        shortly.
                      </div>

                      {/* Zootools Form Start */}
                      <div className="inline-table m-4 flex-col text-center align-middle justify-center">
                        <a
                          target="_blank"
                          href="https://form.zootools.co/go/VtPPU3VRY6t5cvhtLK3H"
                          data-waitlist-id="VtPPU3VRY6t5cvhtLK3H"
                          style={{ all: "unset" }}
                        >
                          <div
                            className="inline w-fit text-gray-50 rounded-md px-4 py-2 bg-[#2c346b]
                            hover:bg-[#2c346b] 
                            hover:shadow-xl      
                            hover:cursor-pointer "
                          >
                            {/* Very Important to add inline/ inline-table */}
                            Join the Waitlist
                          </div>
                        </a>
                      </div>
                      {/* Zootools Form End */}
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
                    {!isLoading && "Congratulations! You’re in!  🥳"}
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
                        {/* Congratulations! You’re in!  */}
                        <br /> Come and Remix your NFTs, Share and monetize your
                        creations to lens and explore 1000s of creative assets!{" "}
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
                    className="bg-blue-500 py-3 px-5 rounded-md text-white hover:shadow-xl"
                  >
                    Launch App
                  </button>
                </div>
              )}

              <div className=""></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthComponent;
