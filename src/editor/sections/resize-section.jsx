import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { Button } from "@blueprintjs/core";
import { GiResize } from "react-icons/gi";
import { useEffect, useState } from "react";
import { ResizeIcon } from "../editor-icon";

const AVAILABLE_SIZES = [
	{ width: 500, height: 500 },
	{ width: 1000, height: 1000 },
	{ width: 1500, height: 1500 },
];

// define the new custom section
export const CustomSizesPanel = {
	name: "sizes",
	Tab: (props) => (
		<SectionTab
			name="Sizes"
			{...props}>
			<ResizeIcon />
		</SectionTab>
	),
	// we need observer to update component automatically on any store changes
	Panel: observer(({ store }) => {
		// we will just render buttons for each size
		// but you also can add your own controls
		// size inputs, etc
		const [width, setWidth] = useState(1000);
		const [height, setHeight] = useState(1000);

		useEffect(() => {
			store.setSize(width, height);
		}, [width, height]);

		return (
			<div>
				<label htmlFor="width">Width (px)</label>
				<input
					name="width"
					type="number"
					min="0"
					value={width}
					onChange={(e) => setWidth(Number(e.target.value))}
				/>
				<br />
				<label htmlFor="height">Height (px)</label>
				<input
					name="height"
					type="number"
					min="0"
					value={height}
					onChange={(e) => setHeight(Number(e.target.value))}
				/>
				{AVAILABLE_SIZES.map(({ width, height }, i) => (
					<Button
						key={i}
						style={{ width: "100%", marginBottom: "20px" }}
						onClick={() => {
							store.setSize(width, height);
						}}>
						{width}x{height}
					</Button>
				))}
			</div>
		);
	}),
};
