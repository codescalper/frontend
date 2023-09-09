import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ShareButton from "./share/ShareButton";
import DownloadBtn from "./download/DownloadBtn";

const TopbarSection = () => {
  const { isConnected } = useAccount();

  return (
    <div className="bg-white mb-2 w-full p-2 sm:overflow-x-auto sm:overflow-y-hidden sm:max-w-[100vw] sticky border">
      <div className="flex items-center justify-between">
        <a href="https://lenspost.xyz" target="_blank">
          <div className="flex items-center justify-between cursor-pointer">
            <img
              className="flex items-center justify-start object-contain mt-2"
              src="/LenspostAlphaLogo.png"
              alt="lenspost"
              width={170}
            />
          </div>
        </a>
        {!isConnected && (
          <div id="first-step">
            <ConnectButton
              label="Connect Wallet"
              chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
              showBalance={{ smallScreen: false, largeScreen: true }}
            />
          </div>
        )}
        {isConnected && (
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

            <div id={`${isConnected ? "fifth-step" : ""}`}>
              <ShareButton />
            </div>
            <DownloadBtn />
            <div id="first-step">
              <ConnectButton
                chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
                showBalance={{ smallScreen: false, largeScreen: true }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopbarSection;
