import { SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../editor-icon";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { getImageSize } from "polotno/utils/image";
import { InputGroup } from "@blueprintjs/core";
import { ImagesGrid } from "polotno/side-panel/images-grid";

const NFTPanel = observer(({ store }) => {
	const [images, setImages] = useState([]);

	async function loadImages() {
		// here we should implement your own API requests
		setImages([]);
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// for demo images are hard coded
		// in real app here will be something like JSON structure
		setImages([{ url: "/one.gif" }, { url: "/two.jpg" }]);
	}

	useEffect(() => {
		loadImages();
	}, []);

	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}>
			<InputGroup
				leftIcon="search"
				placeholder="Search..."
				onChange={(e) => {
					loadImages();
				}}
				style={{
					marginBottom: "20px",
				}}
			/>
			<p>Demo images: </p>
			{/* you can create yur own custom component here */}
			{/* but we will use built-in grid component */}
			<ImagesGrid
				images={images}
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
				isLoading={!images.length}
				loadMore={false}
			/>
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
