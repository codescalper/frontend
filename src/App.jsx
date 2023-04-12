import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { client, challenge, authenticate, getDefaultProfile } from "../api";
import { App as Editor } from "./editor";

export default function App() {
	const [address, setAddress] = useState();
	const [session, setSession] = useState(null);
	const [profileId, setProfileId] = useState("");
	const [handle, setHandle] = useState("");
	const [token, setToken] = useState("");
	useEffect(() => {
		checkConnection();
	}, []);
	async function checkConnection() {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const accounts = await provider.listAccounts();
		if (accounts.length) {
			setAddress(accounts[0]);
			const response = await client.query({
				query: getDefaultProfile,
				variables: { address: accounts[0] },
			});
			setProfileId(response.data.defaultProfile?.id);
			setHandle(response.data.defaultProfile?.handle);
		}
	}
	async function connect() {
		const account = await window.ethereum.send("eth_requestAccounts");
		if (account.result.length) {
			setAddress(account.result[0]);
			const response = await client.query({
				query: getDefaultProfile,
				variables: { address: account[0] },
			});
			setProfileId(response.data.defaultProfile.id);
			setHandle(response.data.defaultProfile.handle);
		}
	}
	async function login() {
		try {
			const challengeInfo = await client.query({
				query: challenge,
				variables: {
					address,
				},
			});
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
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
		<div>
			{!address && <button onClick={connect}>Connect</button>}
			{address && !session && (
				<div onClick={login}>
					<button>Login</button>
				</div>
			)}
			{address && session && <Editor />}
		</div>
	);
}
