import React from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import {
	SidePanel,
	DEFAULT_SECTIONS,
	// TemplatesSection,
	TextSection,
	BackgroundSection,
	UploadSection,
	LayersSection,
} from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { loadFile } from "./file";
import { CustomSizesPanel } from "./sections/resize-section";
import { IconsSection } from "./sections/icons-section";
import { NFTSection } from "./sections/nft-section";
import { StableDiffusionSection } from "./sections/stable-diffusion-section";
import { MyDesignsSection } from "./sections/my-designs-section";
import { useProject } from "./project";

import Topbar from "./topbar/topbar";

import { TemplatesSection } from "./sections/templates-section";

const sections = [
	TemplatesSection,
	NFTSection,
	TextSection,
	MyDesignsSection,
	IconsSection,
	BackgroundSection,
	UploadSection,
	LayersSection,
	CustomSizesPanel,
	StableDiffusionSection,
];

const useHeight = () => {
	const [height, setHeight] = React.useState(window.innerHeight);
	React.useEffect(() => {
		window.addEventListener("resize", () => {
			setHeight(window.innerHeight);
		});
	}, []);
	return height;
};

const Editor = ({ store }) => {
	const project = useProject();
	const height = useHeight();

	const load = () => {
		let url = new URL(window.location.href);
		// url example https://studio.polotno.com/design/5f9f1b0b
		const reg = new RegExp("design/([a-zA-Z0-9_-]+)").exec(url.pathname);
		const designId = (reg && reg[1]) || "local";
		project.loadById(designId);
	};

	const handleDrop = (ev) => {
		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();

		// skip the case if we dropped DOM element from side panel
		// in that case Safari will have more data in "items"
		if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
			return;
		}
		// Use DataTransfer interface to access the file(s)
		for (let i = 0; i < ev.dataTransfer.files.length; i++) {
			loadFile(ev.dataTransfer.files[i], store);
		}
	};

	return (
		<>
			<div
				style={{
					width: "100vw",
					height: height + "px",
					display: "flex",
					flexDirection: "column",
				}}
				onDrop={handleDrop}>
				<div style={{ height: "calc(100% - 75px)" }}>
					<Topbar store={store} />
					<PolotnoContainer>
						<SidePanelWrap>
							<SidePanel
								store={store}
								sections={sections}
							/>
						</SidePanelWrap>
						<WorkspaceWrap>
							<Toolbar store={store} />
							<Workspace store={store} />
							<ZoomButtons store={store} />
						</WorkspaceWrap>
					</PolotnoContainer>
				</div>
			</div>
		</>
	);
};

export default Editor;
