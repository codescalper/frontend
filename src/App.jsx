import { useEffect, useState, createContext } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { client, challenge, authenticate, getDefaultProfile } from "../api";
import { App as Editor } from "./editor";

import { useSigner, useAccount } from "wagmi";

export const LensContext = createContext();

export default function App() {
	// const [address, setAddress] = useState();
	const [session, setSession] = useState(null);
	const [profileId, setProfileId] = useState("");
	const [handle, setHandle] = useState("");
	const [token, setToken] = useState("");

	const { address, isConnecting, isConnected, isDisconnected } = useAccount();

	const { data: signer, isError, isLoading } = useSigner();

	useEffect(() => {
		checkConnection();
	}, []);

	async function checkConnection() {
		const response = await client.query({
			query: getDefaultProfile,
			variables: { address: address },
		});
		setProfileId(response.data.defaultProfile?.id);
		setHandle(response.data.defaultProfile?.handle);
	}
	async function connect() {
		const response = await client.query({
			query: getDefaultProfile,
			variables: { address: address },
		});
		setProfileId(response.data.defaultProfile.id);
		setHandle(response.data.defaultProfile.handle);
	}

	async function login() {
		try {
			const challengeInfo = await client.query({
				query: challenge,
				variables: {
					address,
				},
			});

			const signature = await signer.signMessage(
				challengeInfo.data.challenge.text
			);
			const authData = await client.mutate({
				mutation: authenticate,
				variables: {
					address,
					signature,
				},
			});

			const {
				data: {
					authenticate: { accessToken },
				},
			} = authData;
			localStorage.setItem("lens-auth-token", accessToken);
			setToken(accessToken);
			setSession(authData.data.authenticate);
		} catch (err) {
			console.log("Error signing in: ", err);
		}
	}

	return (
		<LensContext.Provider value={{ session, setSession }}>
			{isDisconnected && <ConnectButton />}
			{isConnected && !session && (
				<div
					onClick={() => {
						connect();
						login();
					}}>
					<button>Sign in with Lens</button>
				</div>
			)}
			{isConnected && session && <Editor />}
		</LensContext.Provider>
	);
}
