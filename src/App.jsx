import { useEffect, useState, createContext } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { App as Editor } from "./editor";

import { useSigner, useAccount } from "wagmi";

export const LensContext = createContext();

export default function App() {
	// const [address, setAddress] = useState();
	const [session, setSession] = useState(
		localStorage.getItem("lens-auth-token") || null
	);
	const [profileId, setProfileId] = useState("");
	const [handle, setHandle] = useState("");
	const [token, setToken] = useState("");

	return (
		<LensContext.Provider
			value={{
				session,
				setSession,
				token,
				setToken,
				handle,
				setHandle,
				profileId,
				setProfileId,
			}}>
			{/* {isDisconnected && <ConnectButton />}
			{isConnected && !session && (
				<div
					onClick={() => {
						connect();
						login();
					}}>
					<button>Sign in with Lens</button>
				</div>
			)}
			{isConnected && session && <Editor />} */}
			{/* <ConnectModal /> */}
			<Editor />
		</LensContext.Provider>
	);
}
