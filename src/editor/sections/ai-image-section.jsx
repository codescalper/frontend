// ---- ----
// ---- Working yet - Under DEV - 20Jul2023 ----
// ---- This section is same as stable-diffusion-section.jsx ----
// ---- ----

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { InputGroup, Button, Icon } from "@blueprintjs/core";
import { Tab, Tabs,} from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import FaBrain from "@meronex/icons/fa/FaBrain";
import { t } from "polotno/utils/l10n";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { useCredits } from "../credits";
import { useInfiniteAPI } from "polotno/utils/use-api";
import { getCrop } from "polotno/utils/image";
import { AIIcon } from "../editor-icon";

// New imports: 
import axios from "axios";
import { Popover2 } from "@blueprintjs/popover2";
import { Input } from "postcss";
import { SearchComponent } from "../../elements";

// Tab1 - Search Tab

const RANDOM_QUERIES = [
"A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters.",
"An otherworldly forest with bioluminescent plants and colorful creatures lurking in the shadows.",
"A futuristic cityscape with towering skyscrapers, flying cars, and holographic billboards lighting up the night sky.",
"A whimsical garden filled with talking animals, oversized flowers, and a magical tree with glowing fruits.",
"A secluded mountain peak covered in a blanket of snow, with a lone cabin nestled among the pines.",
"A bustling marketplace in a medieval fantasy setting, with merchants selling exotic goods and performers entertaining the crowd.",
"An underwater paradise with coral reefs teeming with colorful fish, sea turtles gracefully gliding through the water, and a hidden shipwreck waiting to be explored.",
];

const CompSearch = observer(({ store }) => {
	// load data
	const [query, setQuery] = React.useState("");
	const [data, setData] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

	const [delayedQuery, setDelayedQuery] = React.useState(
		RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]
	);

	const requestTimeout = React.useRef();
	React.useEffect(() => {
		requestTimeout.current = setTimeout(() => {
			setDelayedQuery(query);
		}, 1000);
		return () => {
			clearTimeout(requestTimeout.current);
		};
	}, [query]);

	React.useEffect(() => {
		if (!delayedQuery) {
			return;
		}
		async function load() {
			setIsLoading(true);
			setError(null);
			try {
				const req = await fetch(
					`https://lexica.art/api/v1/search?q=${delayedQuery}`
				);
				const data = await req.json();
				setData(data.images);
			} catch (e) {
				setError(e);
			}
			setIsLoading(false);
		}
		load();
	}, [delayedQuery]);

	return (
		<>
			<input 
                className="border px-2 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500"
				leftIcon="search"
				placeholder={("Search")}
				onChange={(e) => {
					setQuery(e.target.value);
				}}
				type="search"
				style={{
					marginBottom: "20px",
				}}
			/> 
            
			<ImagesGrid
				shadowEnabled={false}
				images={data}
				getPreview={(item) => item.srcSmall}
				isLoading={isLoading}
				error={error}
				onSelect={async (item, pos, element) => {
					if (
						element &&
						element.type === "svg" &&
						element.contentEditable
					) {
						element.set({ maskSrc: item.src });
						return;
					}

					const { width, height } = await getImageSize(item.srcSmall);

					if (
						element &&
						element.type === "image" &&
						element.contentEditable
					) {
						const crop = getCrop(element, {
							width,
							height,
						});
						element.set({ src: item.src, ...crop });
						return;
					}

					const x = (pos?.x || store.width / 2) - width / 2;
					const y = (pos?.y || store.height / 2) - height / 2;
					store.activePage?.addElement({
						type: "image",
						src: item.src,
						width,
						height,
						x,
						y,
					});
				}}
				rowsNumber={2}
			/>
		</>
	);
});


const AIImagePanel = observer(({ store }) => {
	const [currentTab, setCurrentTab] = useState("tabSearch");

	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}>
			<Tabs
				id="TabsExample"
				defaultSelectedTabId="tabSearch"
				onChange={(tabId) => {
					setCurrentTab(tabId);
				}}>
				<Tab
					id="tabSearch"
					title="Search"
				/>
				<Tab
					id="textToImage"
					title="Text to Image"
				/>
			</Tabs>

			<div
				style={{
					height: "calc(100% - 20px)",
					display: "flex",
					flexDirection: "column",
					paddingTop: "20px",
				}}>
                {currentTab === "tabSearch" && <CompSearch store={store} />}

			</div>
		</div>
	);
});


// define the new custom section
export const AIImageSection = {
	name: "AIImage",
	Tab: (props) => (
		<SectionTab
			name="AI Image DEV"
			{...props}>
			<AIIcon />
		</SectionTab>
	),
	// we need observer to update component automatically on any store changes
	Panel: AIImagePanel,
};
