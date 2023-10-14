import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import ShareButton from "./share/ShareButton";
import DownloadBtn from "./download/DownloadBtn";
import { ENVIRONMENT } from "../../../../services";
import ProfileMenu from "./user/ProfileMenu";
import LoginBtn from "./auth/LoginBtn";
import { useAppAuth } from "../../../../hooks/app";

const TopbarSection = () => {
  const isAuthenticated = useAppAuth();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const isSupportedChain = () => {
    if (ENVIRONMENT === "production") {
      if (chain?.id === 137) return true;
    } else {
      if (chain?.id === 80001) return true;
    }
  };

  return (
    <div className="bg-white mb-2 w-full p-2 sm:overflow-x-auto sm:overflow-y-hidden sm:max-w-[100vw] sticky border">
      <div className="flex items-center justify-between">
        <a href="/">
          <div className="flex items-center justify-between cursor-pointer">
            <img
              className="flex items-center justify-start object-contain mt-2"
              src="/LenspostAlphaLogo.png"
              alt="lenspost"
              width={170}
            />
          </div>
        </a>

        {!isAuthenticated && <LoginBtn />}

        {isAuthenticated ? (
          <div className="flex items-center justify-center space-x-6">
            {/* Discord Links - 19Jul2023 */}
            <a
              className="md:w-8 h-8 text-gray-600 transition-transform transform-gpu hover:scale-125 hover:rotate-180 hover:duration-2000"
              target="_blank"
              href="https://discord.gg/yHMXQE2DNb"
            >
              {" "}
              <img src="/topbar-icons/iconDiscord.svg" alt="" />
            </a>

            <div id="fifth-step">
              <ShareButton />
            </div>
            <DownloadBtn />
            <div className="" id="first-step">
              {/* user profile circular */}
              <ProfileMenu />
              {/* {isSupportedChain() ? (
                <></>
              ) : (
                <div className="flex items-center justify-center space-x-6">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md outline-none"
                    onClick={() =>
                      switchNetwork(ENVIRONMENT === "production" ? 137 : 80001)
                    }
                  >
                    Wrong Network
                  </button>
                </div>
              )} */}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TopbarSection;
