import { useState } from "react";
import React from "react";

import { createStore } from "polotno/model/store";
import { createProject, ProjectContext } from "./editor/project";

import "./App.css";
import Editor from "./editor/Editor";

const store = createStore({ key: "nFA5H9elEytDyPyvKL7T" });
window.store = store;
store.addPage();

const project = createProject({ store });
window.project = project;

function App() {
	return (
		<ProjectContext.Provider value={project}>
			<Editor store={store} />
		</ProjectContext.Provider>
	);
}

export default App;
