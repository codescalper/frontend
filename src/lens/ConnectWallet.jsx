import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useContext, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { client, challenge, authenticate, getDefaultProfile } from "../../api";

import { ethers } from "ethers";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSigner } from "wagmi";

import { LensContext } from "../App";

const ConnectWallet = () => {
	const [isOpen, setIsOpen] = useState(true);
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();

	const { data: signer, isError, isLoading } = useSigner();

	useEffect(() => {
		checkConnection();
	}, []);

	const { session, setSession, setProfileId, setToken, setHandle } =
		useContext(LensContext);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	async function checkConnection() {
		const response = await client.query({
			query: getDefaultProfile,
			variables: { address: address },
		});
		setProfileId(response.data.defaultProfile?.id);
		setHandle(response.data.defaultProfile?.handle);
	}
	// async function connect() {
	// 	const response = await client.query({
	// 		query: getDefaultProfile,
	// 		variables: { address: address },
	// 	});
	// 	setProfileId(response.data.defaultProfile.id);
	// 	setHandle(response.data.defaultProfile.handle);
	// }

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
		<>
			<div className="flex items-center justify-center">
				<button
					type="button"
					onClick={openModal}
					className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
					Sign-in with Lens
				</button>
			</div>
			<Transition
				appear
				show={isOpen}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={closeModal}>
					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95">
								{isConnected && !session && (
									<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
										<Dialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900">
											Please sign the message.
										</Dialog.Title>

										<div className="mt-2">
											<p className="text-sm text-gray-500">
												LensPost uses this signature to
												verify that you're the owner of
												this address.
											</p>
										</div>

										<div className="mt-4">
											<button
												type="button"
												className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												onClick={login}>
												Sign-In with Lens
											</button>
										</div>
									</Dialog.Panel>
								)}
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default ConnectWallet;
