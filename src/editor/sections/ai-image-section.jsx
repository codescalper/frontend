// ---- ----
// ---- Working yet - Under DEV - 20Jul2023 ----
// ---- This section is same as stable-diffusion-section.jsx ----
// ---- ----

import React, { useState, useEffect, useRef } from "react";
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

import { useTour } from '@reactour/tour'

// Tab1 - Search Tab

const RANDOM_QUERIES = [
"A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters.",
"An otherworldly forest with bioluminescent plants and colorful creatures lurking in the shadows.",
];

// This array is to display other queries on the frontend - 22Jul2023
const RANDOM_QUERIES2 = [
// "A bustling marketplace in a medieval fantasy setting",
"Merchants selling exotic goods and performers entertaining the crowd.",
"An underwater paradise with coral reefs teeming with colorful fish",
// "Sea turtles gracefully gliding through the water, and a hidden shipwreck waiting to be explored.",
]

// This array is to display short words as prompts on the frontend - 22Jul2023
const RANDOM_QUERIES3 = [
	"Mountains", "Hearts", "Robots", "NFTS", "Elon",
]

const CompSearch = observer(({ store }) => {
	// load data
	const [data, setData] = useState(null);
	const [stStatusCode, setStStatusCode] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const [delayedQuery, setDelayedQuery] = useState(
		RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]
	);
	const [query, setQuery] = useState(
		// RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]
		// delayedQuery
	);

	const requestTimeout = useRef();
	useEffect(() => {
		requestTimeout.current = setTimeout(() => {
			 setDelayedQuery(query);
		}, 1000);
		return () => {
			clearTimeout(requestTimeout.current);
		};
	}, [query]);

	
	const fnGenerateImages = () =>{
		if (!delayedQuery) {
			return;
		}
		async function load() {
			setIsLoading(true);
			setError(null);
			try {
				const data = await axios.get(
					`https://lexica.art/api/v1/search?q=${delayedQuery}`
				);
				// const data = await req.json();
				console.log(data);
				setStStatusCode(data.status)
				setData(data.data.images);
			} catch (e) {
				console.log("There is an error");
				console.log(e);
				setError(e);
			}
			setIsLoading(false);
		}
		load();
		
	}
	useEffect(() => {
			fnGenerateImages();
	}, [delayedQuery]);

	// useEffect(()=>{
	// 	fnGenerateImages
	// },[])
	return (
		<>	
			<div className="">

			<div className="flex flex-col">

			<textarea 
                className="h-16 mb-2 border px-4 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500"
				leftIcon="search"	
				placeholder={query || ("Search or Give a prompt")}
				onChange={(e) => {
					setQuery(e.target.value);
				}}
				onKeyPress= { (e) => { if (e.key === 'Enter') { 
					setQuery(e.target.value);
				} }} 
				value={query}
				type="search"
				/> 

			<button className="bg-[#E1F26C] w-full px-4 p-1  mb-4 rounded-md hover:bg-[#e0f26cce]" onClick={fnGenerateImages}>Generate</button>
			</div>
			<div className="flex flex-row overflow-x-scroll">


			{RANDOM_QUERIES3.map((val, key)=>{
				return(
					<div onClick={ () => setQuery(val)} className="m-1 mb-2 px-2 py-1 text-xs rounded-md cursor-pointer bg-slate-200 hover:bg-slate-100">{val}</div>
					)
				})
			}
			</div>

			{RANDOM_QUERIES2.map((val, key)=>{
				return(
					<div onClick={ () => setQuery(val)} className="m-1 mb-2 px-2 py-1 text-xs rounded-md cursor-pointer bg-slate-200 hover:bg-slate-100 overflow-x-scroll">{val}</div>
					)
				})
			}
			</div>
		{
			stStatusCode == "200" && 
		
			<ImagesGrid
				shadowEnabled={false}
				images={data}
				// Different URLs for Preview and Canvas (srcSmall and src)
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

					const { width, height } = await getImageSize(item.src);

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
		}
		{
			stStatusCode == "429" && 
			<div className="mt-4 p-2 text-orange-600">
				Rate Limited for now, Please check back after 30s
			</div>
		}
			{/* {!data && "Start exploring"} */}
		</>
	);
});


const AIImagePanel = observer(({ store }) => {
	const [currentTab, setCurrentTab] = useState("tabPrompt");
	
	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}>
			<Tabs
				id="TabsExample"
				defaultSelectedTabId="tabPrompt"
				onChange={(tabId) => {
					setCurrentTab(tabId);
				}}>
				<Tab
					id="tabPrompt"
					title="Prompt"
				/>
				{/* <Tab
					id="textToImage"
					title="Text to Image"
				/> */}
			</Tabs>

			<div
				style={{
					height: "calc(100% - 20px)",
					display: "flex",
					flexDirection: "column",
					paddingTop: "20px",
				}}>
                {currentTab === "tabPrompt" && <CompSearch store={store} />}

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
