import { createStore } from "polotno/model/store";
import Editor from "./Editor";
import { POLOTNO_API_KEY } from "../services/env";

const store = createStore({ key: POLOTNO_API_KEY });
window.store = store;
store.addPage();

const EditorWrapper = () => {
  return <Editor store={store} />;
};

export default EditorWrapper;
