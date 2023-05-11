import React from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteAPI } from "polotno/utils/use-api";

import { SectionTab } from "polotno/side-panel";

import { ImagesGrid } from "polotno/side-panel/images-grid";
import { TemplatesIcon } from "../editor-icon";

export const MyDesignsPanel = observer(({ store }) => {
	// load data
	const { data, isLoading } = useInfiniteAPI({
		getAPI: ({ page }) => `templates/page${page}.json`,
	});

	return (
		<div className="h-full flex flex-col">
			<h1 className="text-lg">My Designs</h1>

			<ImagesGrid
				shadowEnabled={false}
				images={data?.map((data) => data.items).flat()}
				getPreview={(item) => `/templates/${item.preview}`}
				isLoading={isLoading}
				onSelect={async (item) => {
					// download selected json
					const req = await fetch(`/templates/${item.json}`);
					const json = await req.json();
					// just inject it into store
					store.loadJSON(json);
				}}
				rowsNumber={1}
			/>
		</div>
	);
});

// define the new custom section
export const MyDesignsSection = {
	name: "My Designs",
	Tab: (props) => (
		<SectionTab
			name="My Designs"
			{...props}>
			<TemplatesIcon />
		</SectionTab>
	),
	// we need observer to update component automatically on any store changes
	Panel: MyDesignsPanel,
};
