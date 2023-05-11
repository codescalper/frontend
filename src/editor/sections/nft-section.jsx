import { SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../editor-icon";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { getImageSize } from "polotno/utils/image";
import { InputGroup } from "@blueprintjs/core";
import { ImagesGrid } from "polotno/side-panel/images-grid";

const NFTPanel = observer(({ store }) => {
	const [tab, setTab] = useState("lenspost");

	return (
		<div className="h-full flex flex-col">
			<h1 className="text-lg">NFT</h1>
			<div className="flex items-center justify-center space-x-2 my-4">
				<button
					className="w-1/2 border px-2 py-1 rounded-md bg-[#1B1A1D] text-white"
					onClick={() => setTab("lenspost")}>
					Lenspost NFT Library
				</button>
				<button
					className="w-1/2 border border-black px-2 py-1 rounded-md"
					onClick={() => setTab("wallet")}>
					My Wallet NFTs
				</button>
			</div>
			{tab === "lenspost" && <LenspostNFT />}
			{tab === "wallet" && <WalletNFT />}
		</div>
	);
});

// define the new custom section
export const NFTSection = {
	name: "NFT",
	Tab: (props) => (
		<SectionTab
			name="NFT"
			{...props}>
			<NFTIcon />
		</SectionTab>
	),
	// we need observer to update component automatically on any store changes
	Panel: NFTPanel,
};

const LenspostNFT = () => {
	const [lenspostNFTImages, setLenspostNFTImages] = useState([]);

	async function loadImages() {
		// here we should implement your own API requests
		setLenspostNFTImages([]);
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// for demo images are hard coded
		// in real app here will be something like JSON structure
		setLenspostNFTImages([{ url: "/one.gif" }, { url: "/two.jpg" }]);
	}

	useEffect(() => {
		loadImages();
	}, []);
	return (
		<>
			<input
				className="mb-4 border px-2 py-1 rounded-md"
				placeholder="Search"
				onChange={(e) => {
					loadImages();
				}}
			/>
			{/* you can create yur own custom component here */}
			{/* but we will use built-in grid component */}
			<ImagesGrid
				images={lenspostNFTImages}
				getPreview={(image) => image.url}
				onSelect={async (image, pos) => {
					const { width, height } = await getImageSize(image.url);
					store.activePage.addElement({
						type: "image",
						src: image.url,
						width,
						height,
						// if position is available, show image on dropped place
						// or just show it in the center
						x: pos ? pos.x : store.width / 2 - width / 2,
						y: pos ? pos.y : store.height / 2 - height / 2,
					});
				}}
				rowsNumber={2}
				isLoading={!lenspostNFTImages.length}
				loadMore={false}
			/>
		</>
	);
};
const WalletNFT = () => {
	const [walletNFTImages, setWalletNFTImages] = useState([]);

	async function loadImages() {
		// here we should implement your own API requests
		setWalletNFTImages([]);
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// for demo images are hard coded
		// in real app here will be something like JSON structure
		setWalletNFTImages([{ url: "/two.jpg" }, { url: "/one.gif" }]);
	}

	useEffect(() => {
		loadImages();
	}, []);
	return (
		<>
			<input
				className="mb-4 border px-2 py-1 rounded-md"
				placeholder="Search"
				onChange={(e) => {
					loadImages();
				}}
			/>
			{/* you can create yur own custom component here */}
			{/* but we will use built-in grid component */}
			<ImagesGrid
				images={walletNFTImages}
				getPreview={(image) => image.url}
				onSelect={async (image, pos) => {
					const { width, height } = await getImageSize(image.url);
					store.activePage.addElement({
						type: "image",
						src: image.url,
						width,
						height,
						// if position is available, show image on dropped place
						// or just show it in the center
						x: pos ? pos.x : store.width / 2 - width / 2,
						y: pos ? pos.y : store.height / 2 - height / 2,
					});
				}}
				rowsNumber={2}
				isLoading={!walletNFTImages.length}
				loadMore={false}
			/>
		</>
	);
};
