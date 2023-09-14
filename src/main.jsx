import React from "react";
import ReactDOM from "react-dom/client";
import { Wrapper } from "./wrapper";
import "./styles/index.css";
import "../polyfills";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Wrapper />
  </React.StrictMode>
);
