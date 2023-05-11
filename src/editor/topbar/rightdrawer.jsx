import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BiChevronRight from "@meronex/icons/bi/BiChevronRight";
import { ShareIcon } from "../editor-icon";
import MdcCalendarClock from "@meronex/icons/mdc/MdcCalendarClock";
import BsLink45Deg from "@meronex/icons/bs/BsLink45Deg";
import { Switch } from "@headlessui/react";

export default function RightDrawer({}) {
	const [open, setOpen] = useState(false);
	const [menu, setMenu] = useState("share");

	return (
		<>
			<button onClick={() => setOpen(!open)}>
				<ShareIcon />
			</button>
			<Transition.Root
				show={open}
				as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-0"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-0"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-hidden">
						<div className="absolute inset-0 overflow-hidden">
							<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 top-[13.5%]">
								<Transition.Child
									as={Fragment}
									enter="transform transition ease-in-out duration-500 sm:duration-700"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-500 sm:duration-700"
									leaveFrom="translate-x-0"
									leaveTo="translate-x-full">
									<Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
										<Transition.Child
											as={Fragment}
											enter="ease-in-out duration-500"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="ease-in-out duration-500"
											leaveFrom="opacity-100"
											leaveTo="opacity-0">
											<div className="">
												<div className="absolute left-0 top-0  flex flex-col items-center justify-center">
													<div
														className="-ml-32 flex items-center justify-center flex-col"
														onClick={() =>
															setMenu("share")
														}>
														<button className="bg-white h-12 w-12 rounded-full outline-none">
															<ShareIcon />
														</button>
														<p>Share</p>
													</div>
													<div
														className="-ml-32 flex items-center justify-center flex-col"
														onClick={() =>
															setMenu(
																"monetization"
															)
														}>
														<button className="bg-white h-12 w-12 rounded-full outline-none">
															<ShareIcon />
														</button>
														<p className="w-20 text-center">
															Monetization
															settings
														</p>
													</div>
													<div
														className="-ml-32 flex items-center justify-center flex-col"
														onClick={() =>
															setMenu("post")
														}>
														<button className="bg-white h-12 w-12 rounded-full outline-none">
															<ShareIcon />
														</button>
														<p className="w-20 text-center">
															Comment & Mirror
														</p>
													</div>
												</div>
												<div className="absolute left-0 top-1/2 flex -ml-5 flex-col items-center justify-center">
													<button
														type="button"
														className="rounded-xl outline-none "
														onClick={() =>
															setOpen(false)
														}>
														<BiChevronRight className="h-10 w-6 bg-white rounded-sm" />
													</button>
												</div>
											</div>
										</Transition.Child>
										{menu === "share" && <Share />}
										{menu === "monetization" && (
											<Monetization />
										)}
										{/* {menu === "post" && <Post />} */}
										{menu === "post" && <Share />}
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}

const Share = () => {
	return (
		<div className="flex h-screen flex-col overflow-y-scroll bg-white shadow-xl">
			<div className="">
				<Dialog.Title className="text-xl leading-6 bg-gray-900 text-white p-6">
					Share this design
				</Dialog.Title>
			</div>
			<div className="relative mt-6 px-4 pt-2 pb-4 sm:px-6 ">
				<div className="space-y-4">
					<div className="flex items-center justify-between"></div>
					<div className="space-x-4">
						<textarea className="border border-b-8 w-full h-40" />
					</div>
					<div className="flex items-center justify-between ">
						<div className="flex items-center justify-center w-full text-md bg-[#E1F26C]  py-2 h-10 rounded-md">
							<BsLink45Deg />
							Share
						</div>
						<div className="py-2 rounded-md">
							<MdcCalendarClock className="h-10 w-10 " />
						</div>
					</div>
				</div>
			</div>
			<hr />
			<div className="relative mt-6 px-4 sm:px-6 ">
				<p className="text-lg">Share on socials</p>
				<div className="flex items-center justify-center space-x-12 py-5">
					<div>Lens</div>
					<div>Lens</div>
					<div>Lens</div>
					<div>Lens</div>
				</div>
			</div>
			<hr />
		</div>
	);
};

const Monetization = () => {
	const [enabled, setEnabled] = useState(false);
	return (
		<div className="flex h-screen flex-col overflow-y-scroll bg-white shadow-xl">
			<div className="">
				<Dialog.Title className="text-xl leading-6 p-6">
					Monetization Settings
				</Dialog.Title>
			</div>
			<div className="relative px-4 pt-2 pb-4 sm:px-6 ">
				<div className="">
					<div className="flex flex-col justify-between">
						<Switch.Group>
							<div className="flex items-center mb-4">
								<Switch
									checked={enabled}
									onChange={setEnabled}
									className={`${
										enabled ? "bg-blue-600" : "bg-gray-200"
									} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
									<span
										className={`${
											enabled
												? "translate-x-6"
												: "translate-x-1"
										} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
									/>
								</Switch>
								<Switch.Label className="ml-4">
									Enable notifications
								</Switch.Label>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Charge for collecting
								</h2>
								<Switch
									checked={enabled}
									onChange={setEnabled}
									className={`${
										enabled ? "bg-blue-600" : "bg-gray-200"
									} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
									<span
										className={`${
											enabled
												? "translate-x-6"
												: "translate-x-1"
										} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
									/>
								</Switch>
								<Switch.Label className="ml-4">
									Get paid when someone collects your post
								</Switch.Label>
								<div className="flex">
									<div className="flex flex-col w-1/2 p-2">
										<label htmlFor="price">Price</label>
										<input
											className="border border-black rounded-md p-2"
											type="number"
											min={"0"}
											step={"0.01"}
											placeholder="0.0$"
										/>
									</div>
									<div className="flex flex-col w-1/2 p-2">
										<label htmlFor="price">Currency</label>
										<select
											name="cars"
											id="cars"
											placeholder="Wrapped Matic"
											className="border border-black rounded-md p-2">
											<option value="wmatic">
												Wrapped MATIC
											</option>
											<option value="weth">
												Wrapped ETH
											</option>
											<option value="dai">DAI</option>
											<option value="usdc">USDC</option>
										</select>
									</div>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Mirror referral award
								</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Share your fee with people who amplify
										your content
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Limited Edition
								</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Make the collects exclusive
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">Time Limit</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Limit collecting to first 24 hours
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">Split Revenue</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Set multiple recipients for the collect
										fee
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Who can collect
								</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Only followers can collect
									</Switch.Label>
								</div>
							</div>
						</Switch.Group>
					</div>
				</div>
			</div>
		</div>
	);
};

const Post = () => {
	return <p>post</p>;
};
