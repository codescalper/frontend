import "../polyfills";
// https://github.com/xmtp/xmtp-js/issues/487
import React from "react";
import ReactDOM from "react-dom/client";
import { Wrapper } from "./wrapper";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";

// Pre-render the app
// Reference : https://www.npmjs.com/package/react-snap

import { hydrate, render } from "react-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Wrapper />
//   </React.StrictMode>
// );
const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<Wrapper />, rootElement);
} else {
  render(<Wrapper />, rootElement);
}
// const rootElement = document.getElementById("root");
// if (rootElement.hasChildNodes()) {
//   ReactDOM.hydrate(
//     <React.StrictMode>
//       <Wrapper />
//     </React.StrictMode>,
//     rootElement
//   );
// } else {
//   ReactDOM.render(
//     <React.StrictMode>
//       <Wrapper />
//     </React.StrictMode>,
//     rootElement
//   );
// }
