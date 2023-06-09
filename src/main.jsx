import React from "react";
import ReactDOM from "react-dom/client";
import { Wrapper } from "./wrapper";
import "./index.css";
import "../polyfills";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Wrapper />
	</React.StrictMode>
);
