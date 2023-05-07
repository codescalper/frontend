import { observer } from "mobx-react-lite";
import { DownloadButton } from "./download-button";
import { useDisconnect, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu } from "@headlessui/react";
import RightDrawer from "./rightdrawer";

export default observer(({ store }) => {
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
				{isDisconnected && <ConnectButton />}
				{isConnected && (
					<div className="flex items-center justify-center space-x-6">
						<RightDrawer />
						<DownloadButton store={store} />
						<button
							onClick={() => {
								disconnect();
							}}>
							Disconnect
						</button>
					</div>
				)}
			</div>
		</div>
	);
});

// console.log("session before:", session);
// setSession(null);
// console.log("session after:", session);
// localStorage.removeItem("lens-auth-token");
