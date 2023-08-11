export const TemplatesIcon = () => {
	return (
		<img
			src="/sidebar-icons/templates.svg"
			alt="templates"
		/>
	);
};
export const NFTIcon = () => {
	return (
		<img
			src="/sidebar-icons/nft.svg"
			alt="nft"
		/>
	);
};
export const TextIcon = () => {
	return (
		<img
			src="/sidebar-icons/text.svg"
			alt="text"
		/>
	);
};
export const ElementsIcon = () => {
	return (
		<img
			src="/sidebar-icons/elements.svg"
			alt="elements"
		/>
	);
};
export const BackgroundIcon = () => {
	return (
		<img
			src="/sidebar-icons/background.svg"
			alt="background"
		/>
	);
};
export const UploadIcon = () => {
	return (
		<img
			src="/sidebar-icons/upload.svg"
			alt="upload"
		/>
	);
};
export const LayersIcon = () => {
	return (
		<img
			src="/sidebar-icons/layers.svg"
			alt="layers"
		/>
	);
};
export const ResizeIcon = () => {
	return (
		<img
			src="/sidebar-icons/resize.svg"
			alt="resize"
		/>
	);
};
export const AIIcon = () => {
	return (
		<img
			src="/sidebar-icons/ai.svg"
			alt="ai"
		/>
	);
};
import SuDownloadAlt from '@meronex/icons/su/SuDownloadAlt';
export const ExportIcon = () => {
	return (
		<div className="flex flex-col justify-center items-center cursor-pointer">
			{/* <img
				src="/topbar-icons/export.svg"
				alt="export"
			/> */}
			
				<SuDownloadAlt size="24"/> 
			<p className="mt-1 text-md">Export</p>
		</div>
	);
};
import SuForward from '@meronex/icons/su/SuForward';
export const ShareIcon = () => {
	return (
		<div className="flex flex-col items-center justify-center cursor-pointer">
			{/* <img
				src="/topbar-icons/share.svg"
				alt="share"
			/> 
			*/}
			<SuForward size="26"/>
			<p className="text-md">Share</p>
		</div>
	);
};
