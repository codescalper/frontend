import { SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../editor-icon";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { getImageSize } from "polotno/utils/image";
import { InputGroup } from "@blueprintjs/core";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { getNFTs, getNFTsById } from "../../services/backendApi";
import { useAccount } from "wagmi";

const NFTPanel = observer(({ store }) => {
	const [tab, setTab] = useState("lenspost");
	const { isConnected } = useAccount();
	return (
		<div className="h-full flex flex-col">
			<h1 className="text-lg">NFT</h1>
			<div className="flex items-center justify-center space-x-2 my-4">
				<button
					className={`w-1/2 border px-2 py-1 border-black rounded-md ${
						tab === "lenspost" && "bg-[#1B1A1D]"
					} ${tab === "lenspost" && "text-white"}`}
					onClick={() => setTab("lenspost")}>
					Lenspost NFT Library
				</button>
				<button
					className={`w-1/2 border border-black px-2 py-1 rounded-md ${
						tab === "wallet" && "bg-[#1B1A1D]"
					} ${tab === "wallet" && "text-white"}`}
					onClick={() => setTab("wallet")}>
					My Wallet NFTs
				</button>
			</div>
			{tab === "lenspost" && <LenspostNFT />}
			{tab === "wallet" && isConnected && <WalletNFT />}
			{tab === "wallet" && !isConnected && (
				<div className="flex items-center justify-center h-full">
					<p>Please Connect your Wallet to see your NFTs</p>
				</div>
			)}
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
	const CATEGORIES = ["Nouns", "Moonbirds", "CryptoPunks", "QQL"];

	const [lenspostNFTImages, setLenspostNFTImages] = useState([]);
	const [activeCat, setActiveCat] = useState(null);

	async function loadImages() {
		// here we should implement your own API requests
		setLenspostNFTImages([]);
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// for demo images are hard coded
		// in real app here will be something like JSON structure
		setLenspostNFTImages([{ url: "/one.gif" }, { url: "/two.jpg" }]);
	}

	function RenderCategories() {
		return CATEGORIES.map((item) => {
			return (
				<div
					className=""
					key={item}>
					<div
						className="flex items-center space-x-4 p-2 mb-4 cursor-pointer"
						onClick={() => setActiveCat(item)}>
						<img
							src={`/nft-collections/${item}.svg`}
							alt={`${item}`}
						/>
						<p className="text-lg font-normal">{item}</p>
					</div>
				</div>
			);
		});
	}

	function RenderImages() {
		return (
			<div className="">
				<div className="">
					<button onClick={() => goBack()}>go back</button>
					<h1 className="text-lg font-bold">{activeCat}</h1>
				</div>
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
			</div>
		);
	}

	function goBack() {
		setActiveCat(null);
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
			{activeCat === null ? <RenderCategories /> : <RenderImages />}

			{/* <RenderCategories />
			<RenderImages /> */}
		</>
	);
};
const WalletNFT = () => {
	const [walletNFTImages, setWalletNFTImages] = useState([]);
	const [text, setText] = useState("");
	const { address } = useAccount();

	const convertIPFSUrl = (ipfsUrl) => {
		const cid = ipfsUrl.replace("ipfs://", ""); // Remove 'ipfs://' prefix
		return `https://ipfs.io/ipfs/${cid}`;
	};

	const searchNFT = async () => {
		let obj = {};
		let arr = [];
		const nftById = await getNFTsById(text);
		if (nftById) {
			nftById.permaLink = convertIPFSUrl(nftById.permaLink);
			obj = { url: nftById.permaLink };
			arr.push(obj);
		}
		setWalletNFTImages(arr);
		console.log("nftById", arr);

		if (!text) {
			loadImages();
		}
	};

	async function loadImages() {
		// here we should implement your own API requests
		const res = await getNFTs(address);
		let obj = {};
		let arr = [];
		for (let i = 0; i < res.length; i++) {
			if (res[i].permaLink.includes("ipfs://")) {
				res[i].permaLink = convertIPFSUrl(res[i].permaLink);
				obj = { url: res[i].permaLink };
				arr.push(obj);
			}
		}
		setWalletNFTImages(arr);
	}

	useEffect(() => {
		searchNFT();
	}, [text]);

	useEffect(() => {
		loadImages();
	}, [address]);

	return (
		<div>
			<input
				className="mb-4 border px-2 py-1 rounded-md w-full"
				placeholder="Search"
				onChange={(e) => setText(e.target.value)}
				value={text}
			/>
			{/* you can create yur own custom component here */}
			{/* but we will use built-in grid component */}
			{/* {walletNFTImages.length > 0 && ( */}
			<ImagesGrid
				images={walletNFTImages}
				key={walletNFTImages}
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
			{/* )} */}
		</div>
	);
};
