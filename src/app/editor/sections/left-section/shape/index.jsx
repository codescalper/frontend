import React from "react";

import { SectionTab } from "polotno/side-panel";
import { Shapes } from "polotno/side-panel/elements-panel";
import { Icon } from "@blueprintjs/core";
import { useStore } from "../../../../../hooks";

 const ShapesPanel = () => {
  const store = useStore();
  return <Shapes store={store} />;
};

// // define the new custom section
 const ShapesSection = {
  name: "shapes",
  Tab: (props) => (
    <SectionTab name="Shapes" {...props}>
      <Icon icon="shapes" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: ShapesPanel,
};

export default ShapesSection;