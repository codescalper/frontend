import React from "react";
import ReactDOM from "react-dom/client";
import { Wrapper } from "./wrapper";
import "./styles/index.css";
import "../polyfills";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";

import { TourProvider } from "@reactour/tour";
import { OnboardingSteps } from "./app/editor/common";

const radius = 8;

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    {/* Reactour wrap around Start */}
    <TourProvider
      steps={OnboardingSteps}
      padding={{
        mask: 4,
        popover: [64, 8],
        wrapper: 0,
      }}
      styles={{
        popover: (base) => ({
          ...base,
          "--reactour-accent": "#2c346b",
          borderRadius: radius,
          // top: 32,
          marginTop: "24",
          marginRight: "64",
          marginBottom: "32",
        }),
        maskArea: (base) => ({ ...base, rx: radius }),
        maskWrapper: (base) => ({ ...base, color: "" }),
        badge: (base) => ({ ...base, right: "auto", left: "-0.8em" }),
        controls: (base) => ({ ...base, marginTop: 24 }),
        close: (base) => ({ ...base, left: "auto", right: 16, top: 24 }),
      }}
    >
      <Wrapper />
    </TourProvider>

    {/* Reactour wrap around End */}
  </>
);
