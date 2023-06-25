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


const API = "https://api.polotno.dev/api";

const GenerateTab = observer(({ store }) => {
	const inputRef = React.useRef(null);
	const [image, setImage] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const { credits, consumeCredits } = useCredits(
		"stableDiffusionCredits",
		10
	);

	const handleGenerate = async () => {
		if (credits <= 0) {
			alert("You have no credits left");
			return;
		}
		setLoading(true);
		setImage(null);

		const req = await fetch(
			`${API}/get-stable-diffusion?KEY=${getKey()}&prompt=${
				inputRef.current.value
			}`
		);
		setLoading(false);
		if (!req.ok) {
			alert("Something went wrong, please try again later...");
			return;
		}
		consumeCredits();
		const data = await req.json();
		setImage(data.output[0]);
	};

	return (
		<>
			<div style={{ height: "40px", paddingTop: "5px" }}>
				Generate image with Stable Diffusion AI (BETA)
			</div>
			<div style={{ padding: "15px 0" }}>
				Stable Diffusion is a latent text-to-image diffusion model
				capable of generating photo-realistic images given any text
				input
			</div>
			<InputGroup
				placeholder="Type your image generation prompt here..."
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleGenerate();
					}
				}}
				style={{
					marginBottom: "20px",
				}}
				inputRef={inputRef}
			/>
			<p style={{ textAlign: "center" }}>
				{!!credits && <div>You have ({credits}) credits.</div>}
				{!credits && (
					<div>You have no credits. They will renew tomorrow.</div>
				)}
			</p>
			<Button
				onClick={handleGenerate}
				intent="primary"
				loading={loading}
				style={{ marginBottom: "40px" }}
				disabled={credits <= 0}>
				Generate
			</Button>
			{image && (
				<ImagesGrid
					shadowEnabled={false}
					images={image ? [image] : []}
					getPreview={(item) => item}
					isLoading={loading}
					onSelect={async (item, pos, element) => {
						const src = item;
						if (
							element &&
							element.type === "svg" &&
							element.contentEditable
						) {
							element.set({ maskSrc: src });
							return;
						}

						if (
							element &&
							element.type === "image" &&
							element.contentEditable
						) {
							element.set({ src: src });
							return;
						}

						const { width, height } = await getImageSize(src);
						const x = (pos?.x || store.width / 2) - width / 2;
						const y = (pos?.y || store.height / 2) - height / 2;
						store.activePage?.addElement({
							type: "image",
							src: src,
							width,
							height,
							x,
							y,
						});
					}}
					rowsNumber={1}
				/>
			)}
		</>
	);
});

const RANDOM_QUERIES = [
	"Magic mad scientist, inside cosmic labratory, radiating a glowing aura stuff, loot legends, stylized, digital illustration, video game icon, artstation, ilya kuvshinov, rossdraws",
	"cute duckling sitting in a teacup, photography, minimalistic, 8 k ",
	"anime girl",
	"an mascot robot, smiling, modern robot, round robot, cartoon, flying, fist up, crypto coins background",
];

const SearchTab = observer(({ store }) => {
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
			<InputGroup
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
			{/* <p>
				Search AI images with{" "}
				<a
					href="https://lexica.art/"
					target="_blank">
					https://lexica.art/
				</a>
			</p> */}
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

const StableDiffusionPanel = observer(({ store }) => {
	const [selectedTabId, setSelectedTabId] = React.useState("search");
	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}>
			<Tabs
				id="TabsExample"
				defaultSelectedTabId="search"
				onChange={(tabId) => {
					setSelectedTabId(tabId);
				}}>
								<Tab
					id="search"
					title="Search"
				/>
				{/* <Tab
					id="generate"
					title="Generate"
				/>
				<Tab
					id="designify"
					title="Designify"
				/> */}
				{/* <Tab
					id="textToImage"
					title="Text to Image"
				/> */}
				<Tab
					id="textToImage2"
					title="Text to Image 2"
				/>
			</Tabs>
			<div
				style={{
					height: "calc(100% - 20px)",
					display: "flex",
					flexDirection: "column",
					paddingTop: "20px",
				}}>
				{selectedTabId === "search" && <SearchTab store={store} />}
				{/* {selectedTabId === "generate" && <GenerateTab store={store} />}
				{selectedTabId === "designify" && <DesignifyTab store={store} />} */}
				{/* {selectedTabId === "textToImage" && <TextToImageTab store={store} />} */}
				{selectedTabId === "textToImage2" && <TextToImage2Tab store={store} />}
			</div>
		</div>
	);
});
// New Tab - Designify Start

//API KEY - eea3ea9b371d1ad5fdd62387d42009ed
// https://www.designify.com/dashboard?tab=api-key

const DesignifyTab = observer(({ store }) => {
	// const [selectedTabId, setSelectedTabId] = React.useState("designify");
	const fileInputRef = useRef(null);

	console.log(`Store variable`); 
	console.log(store); 

	const handleImageUpload = async () => {
	  try {
		const file = fileInputRef.current.files[0];
		
		console.log(file);

		const formData = new FormData();
		formData.append("image_file", file);
  
		const response = await axios.post(
		  "https://api.designify.com/v1.0/designify/:designID",
		  formData,
		  {
			headers: {
			  "Content-Type": "multipart/form-data",
			//   "X-Api-Key": "eea3ea9b371d1ad5fdd62387d42009ed",
			  "X-Api-Key": "9822b7f73ff3bea87eee20370ac3982e",
			},
			responseType: "arraybuffer",
			encoding: null,
		  }
		);
  
		if (response.status === 200) {
		  const imageBlob = new Blob([response.data]);
		  const imageUrl = URL.createObjectURL(imageBlob);
		  const link = document.createElement("a");
		  link.href = imageUrl;
		  link.download = "design.png";
		  link.click();
		} else {
		  console.error("Error:", response.status, response.statusText);
		}
	  } catch (error) {
		// console.log(error.response.data);
		console.log(error);

	  }
	};

	return (
		<>
			<div style={{ height: "40px", paddingTop: "5px" }}>
				Inside Designify Tab
				{/* ------------------------------------------------------ */}
				{/* Just for DEV testing */}
				{/* <BgRemove/> */}
				{/* ------------------------------------------------------ */}
			</div>
			<div>
				<input type="file" ref={fileInputRef} />
				<button onClick={handleImageUpload}>Upload</button>
			</div>
		</>
	);
});

// New Tab - Designify End

// 07e9340b97c84afeb46b83899d64701f

// Yet to be completed - 21Jun2023 -----
// New Tab - Text to Image Start
const TextToImageTab2 = observer(({ store }) => { 

	const [stTextInput, setStTextInput] = useState(""); 
	const [stImageUrl, setStImageUrl] = useState("");
	const [stTaskId, setStTaskId] = useState(0);
	const [stImageLoadStatus, setStImageLoadStatus] = useState(0);
	const [stStatusCode, setStStatusCode] = useState(0);
	const [stLoading, setStLoading] = useState(false);
	const [stMoreBtn, setStMoreBtn] = useState(false);

	const varApiKey = '182b5d78366f4bdb9ba093c0be608afa';	
	var varTaskId ;
	const fnHandleText = (evt) => { 
		setStTextInput(evt.target.value)
		console.log(stTextInput);
	}

	const fnCallApi = async () =>{
		console.log(`Handling the API Start - ${stTextInput}`);
		
		const varApiUrl = 'https://www.cutout.pro/api/v1/text2imageAsync';

		const requestData = {
			prompt: `${stTextInput}`,
			height:480,
			width:480
		};

		const config = {
			headers: {
				"Access-Control-Allow-Origin": "https://localhost:5173", 
				'Content-Type': 'application/json',
				'APIKEY': varApiKey,
			},
		};

		axios.post(varApiUrl, requestData, config)
		.then(  res => {
			console.log('Image generation successful!');
			console.log(`The response is: `);
			console.log(res);

			console.log(`The Task Id is: `)
			setStTaskId(res.data.data)
			varTaskId = res?.data.data;
			setStStatusCode(res.data.code)
			console.log(res.data.data)
			console.log("The Query API execution START")

			// //--------------- Generate the Image API - GET Start ---------------
			
			// const apiUrl = 'https://www.cutout.pro/api/v1/getText2imageResult';
			// const taskId = `${res.data.data}`; 
			
			// const config = {
			// 	headers: {
			// 		'APIKEY': varApiKey,
			// 		"Access-Control-Allow-Origin": "https://localhost:5173", 
			// 	},
			// 	params: {
			// 		taskId: taskId,
			// 	},
			// };
			
			// axios.get(apiUrl, config)
			// 	.then(response => {
			// 	console.log('Get text to image result successful!');
			// 	console.log("GET Response is: ");
			// 	console.log(response);
			// 	// Handle the response data here
			// 		setStImageUrl(response.data.data.resultUrl)
			// 		setStImageLoadStatus(response.data.data.status)
			// 	})
			// 	.catch(error => {
			// 	console.error('Error getting text to image result:', error);
			// 	// Handle errors here
			// 	});
			
			// //--------------- Generate the Image API - GET End ---------------

			console.log("The Query API execution END")
		})
		.catch( err => console.log(err))	
		console.log("Handling the API End");
	}
	const fnGetImageAPI = () => {
		const apiUrl = 'https://www.cutout.pro/api/v1/getText2imageResult';

		const config = {
			headers: {
				'APIKEY': varApiKey,
				"Access-Control-Allow-Origin": "https://localhost:5173", 
			},
			params: {
				taskId: varTaskId,
				// taskId: 369316216640539,
			},
		};
		
		axios.get(apiUrl, config)
			.then(response => {
			console.log('Get text to image result successful!');
			console.log("GET Response is: ");
			console.log(response);
			// Handle the response data here
				setStImageUrl(response.data.data.resultUrl);
				setStImageLoadStatus(response.data.data.percentage);
				setStStatusCode(response.data.data.code)
			})
			.catch(error => {
			console.error('Error getting text to image result:', error);
			// Handle errors here
			})	
	}

	// useEffect(()=>{fnGetImageAPI}, [stImageLoadStatus, stTaskId, stStatusCode, stImageUrl])
	useEffect(() => {
    const intervalId = setInterval(()=> {}, 2000); // Run every 5 seconds
    
    // Clear the interval when the component is unmounted or changed
    return () => {
      clearInterval(intervalId);
    };
  },[])

//   New Array of Images:
var imgArray = [{url: "https://picsum.photos/300", },{url: "https://picsum.photos/400", }]

	return ( 
	<>
		<div className="flex flex-row justify-normal align-bottom">

			<textarea rows="4" 
				value={`${stTextInput}`}
				className="m-2 border px-2 py-1 rounded-md" 
				onChange={(e) => { fnHandleText(e) }}
				placeholder="Description of the Image"
			> </textarea>
			<Button icon="search" className="m-2 ml-2 border px-2 py-1 h-8 rounded-md" onClick={fnCallApi}></Button> 
			<Button icon="refresh" className="m-2 ml-2 border px-2 py-1 h-8 rounded-md" onClick={fnGetImageAPI}></Button> 
		</div>
		
		<div className="mt-4"> 
			<div className="bg-[#e0f26c54] hover:bg-[#e0f26c8f] cursor-pointer m-1 pl-2 pr-2 rounded-2xl w-fit text-start text-xs" onClick={()=> setStTextInput("An ancient, mystical forest filled with towering trees")}> An ancient, mystical forest filled with towering trees </div>
			<div className="bg-[#e0f26c54] hover:bg-[#e0f26c8f] cursor-pointer m-1 pl-2 pr-2 rounded-2xl text-start text-xs" onClick={()=> setStTextInput("A peaceful lakeside scene with a vibrant sunset reflecting off the calm waters.")}> A peaceful lakeside scene with a vibrant sunset reflecting off the calm waters. </div>
		</div>
		
		<hr className="mt-4 mb-4"/>
		<div className="m-2 text-[#565656]">
			{stStatusCode != 5010 && stTextInput && `Showing Search results for : ${stTextInput}`}
		</div> 

		{stStatusCode == 5010
			? <div className="p-2 m-2 bg-red-100 rounded-md">
					<div className="flex justify-center mb-2">Server Error</div>
					The server is at capacity, Please try again later
				</div>
			: ""
		} 
		
		{stImageLoadStatus != 100 && `Loading ${stImageLoadStatus}%`}
		
		{stImageLoadStatus == 100 && <img className="m-2 p-2" src={stImageUrl} alt="Searched Image"/> }

		{/* Image Grid */}
		
		{/* { imgArray.map( (x) => { */}
			<div className="">

			{/* Popover here */}
			<Popover2
			className="z-10 relative left-40 top-8"
			interactionKind="click"
			isOpen={stMoreBtn}
			renderTarget={({ isOpen, ref, ...targetProps }) => (
			<Button
				{...targetProps}
				elementRef={ref}
				onClick={() => setStMoreBtn(!stMoreBtn)}
				intent="none"
			>
				{" "}
				<Icon icon="more" />{" "}
			</Button>
			)}
			content={
			<div>
				<Button icon="share"> Share </Button>
				<Button onClick={() => deleteCanvas("4")} icon="trash">
				{" "}
				Delete{" "}
				</Button>
			</div>
			}
		/>
		<div className="" onClick={()=> {

			const width = 100;
			const height = 100;
			store.activePage?.addElement({
			type: 'image',
			src: "https://picsum.photos/200",
			width,
			height, 
			});
			}
		}>
			<img src = "https://picsum.photos/200" width={200} height={150} /> 
		</div>
	</div>  
	</>
	)
})

// New Tab - Text to Image End
// Yet to be completed - 21Jun2023 -----

// New Tab - Text to Image Start 23Jun2023
const TextToImage2Tab = observer(({ store }) => { 

	const [stTextInput, setStTextInput] = useState("")
	const [stImageData, setStImageData] = useState()

	// const varApiKey = "ukZtES93idpHMCid3bk8oCESxaQ0xMiJZByjk4igvfLSYy0mak";	
	const fnHandleText = (evt) => { 
		setStTextInput(evt.target.value)
		console.log(stTextInput);
	}

	const fnCallApi = async () =>{
		console.log(`Handling the API Start - ${stTextInput}`);
		
		const varApiUrl = 'https://api.hotpot.ai/make-art';

		// const requestData = {
		// 	inputText: `${stTextInput}`,
		// 	styleId:"23",
		// 	// width:480
		// };

		const requestData = new FormData();
			requestData.append('inputText', stTextInput);
			requestData.append('styleId', '23');

		const config = {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "ukZtES93idpHMCid3bk8oCESxaQ0xMiJZByjk4igvfLSYy0mak",
			},
		};

		axios.post(varApiUrl, requestData, config)
		.then(  res => {
			console.log('Image generation successful!');
			console.log(`The response is: `);
			console.log(res);
			const imageData = Buffer.from(res.data, 'binary');
			const base64Image = imageData.toString('base64');
			setStImageData(`data:image/png;base64,${base64Image}`);
			
		})
		.catch( err => console.log(err))	
		console.log("Handling the API End");
	}
	
	return ( 
	<>
		<div className="flex flex-col justify-normal align-bottom">

			<textarea rows="4" 
				value={`${stTextInput}`}
				className="m-2 border px-2 py-1 rounded-md" 
				onChange={(e) => { fnHandleText(e) }}
				placeholder="Description of the image"
			> </textarea>
			<Button icon="search" className="bg-[#e0f26c] m-2 ml-2 border px-2 py-1 h-8 rounded-md" onClick={fnCallApi}>Generate Image</Button> 
			{/* <Button icon="refresh" className="m-2 ml-2 border px-2 py-1 h-8 rounded-md" onClick={""}></Button>  */}
		</div>
		
		<div className="mt-4"> 
			<div className="bg-[#e0f26c54] hover:bg-[#e0f26c8f] cursor-pointer m-1 pl-2 pr-2 rounded-2xl w-fit text-start text-xs" onClick={()=> setStTextInput("An ancient, mystical forest filled with towering trees")}> An ancient, mystical forest filled with towering trees </div>
			<div className="bg-[#e0f26c54] hover:bg-[#e0f26c8f] cursor-pointer m-1 pl-2 pr-2 rounded-2xl text-start text-xs" onClick={()=> setStTextInput("A peaceful lakeside scene with a vibrant sunset reflecting off the calm waters.")}> A peaceful lakeside scene with a vibrant sunset reflecting off the calm waters. </div>
		</div>
		
		<hr className="mt-4 mb-4"/>
		<div className="m-2 text-[#565656]">
			{stTextInput && `Showing Search results for : ${stTextInput}`}

			<img src={stImageData} alt="" />
		</div> 

	</>
	)
})

// New Tab - Text to Image End 23Jun2023

// define the new custom section
export const StableDiffusionSection = {
	name: "stable-diffusion",
	Tab: (props) => (
		<SectionTab
			name="AI Image"
			{...props}>
			<AIIcon />
		</SectionTab>
	),
	// we need observer to update component automatically on any store changes
	Panel: StableDiffusionPanel,
};
