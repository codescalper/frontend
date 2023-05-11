import React from "react";
import ReactDOM from "react-dom/client";
import { Wrapper } from "./wrapper";
import "./index.css";
import "../polyfills";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Wrapper />
	</React.StrictMode>
);
