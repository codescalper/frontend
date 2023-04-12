import { useState } from "react";

import { createStore } from "polotno/model/store";
import { createProject, ProjectContext } from "./project";

import Editor from "./Editor";

const store = createStore({ key: "nFA5H9elEytDyPyvKL7T" });
window.store = store;
store.addPage();

const project = createProject({ store });
window.project = project;

export function App() {
	return (
		<ProjectContext.Provider value={project}>
			<Editor store={store} />
		</ProjectContext.Provider>
	);
}
