import { observer } from "mobx-react-lite";
import { DownloadButton } from "./download-button";
import { useDisconnect, useAccount, useNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import RightDrawer from "./rightdrawer";

// New imports:
import { ShareIcon } from "../editor-icon";
import { useState } from "react";

export default observer(({ store }) => {
  
  // 18Jun2023
  const [stIsDrawOpen, setStIsDrawOpen ] = useState(false);
  const { disconnect } = useDisconnect();
  
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  return (
    <div className="bg-white h-[75px]  w-full p-2 sm:overflow-x-auto sm:overflow-y-hidden sm:max-w-[100vw] sticky">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <img
            className="flex items-center justify-start"
            src="/logo.svg"
            alt="lenspost"
          />
        </div>
        {isDisconnected && (
          <ConnectButton
            label="Connect Wallet"
            chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
            showBalance={{ smallScreen: false, largeScreen: true }}
          />
        )}
        {isConnected && (
          <div className="flex items-center justify-center space-x-6">
            
            {/* <div onClick={()=> setStIsDrawOpen(!stIsDrawOpen) }> 
              <ShareIcon/>
            </div> */}
            <RightDrawer/>
            {/* <Drawer classNames={{"inner": "mantine-Drawer-inner"}} position='right' onClose={()=> setStIsDrawOpen(!stIsDrawOpen)} opened={stIsDrawOpen}> 
                <RightDrawerNew/>
            </Drawer> */}

            <DownloadButton store={store} />
            {/* <button
							onClick={() => {
								disconnect();
							}}>
							Disconnect
						</button> */}
            <ConnectButton
              chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
              showBalance={{ smallScreen: false, largeScreen: true }}
            />
          </div>
        )}
      </div>
    </div>
  );
});
