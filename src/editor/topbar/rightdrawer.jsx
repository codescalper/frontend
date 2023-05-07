import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import MdcCloseThick from "@meronex/icons/mdc/MdcCloseThick";
import { NFTIcon, ShareIcon } from "../editor-icon";
import MdcCalendarClock from "@meronex/icons/mdc/MdcCalendarClock";
import BsLink45Deg from "@meronex/icons/bs/BsLink45Deg";

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
						enterTo="opacity-100"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-100"
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
											<div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
												<button
													type="button"
													className="rounded-md outline-none"
													onClick={() =>
														setOpen(false)
													}>
													<span className="sr-only">
														Close panel
													</span>
													<MdcCloseThick className="text-black" />
												</button>
											</div>
										</Transition.Child>
										<Share />
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
				<Dialog.Title className="text-xl leading-6 bg-gray-900 text-white p-4">
					Share this design
				</Dialog.Title>
			</div>
			<div className="relative mt-6 px-4 pt-2 pb-4 sm:px-6 ">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-lg">Description</p>
						<p className="text-xs">ChatGPT</p>
					</div>
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

const Monetization = () => {};

const Post = () => {};
