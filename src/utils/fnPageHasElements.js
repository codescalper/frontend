// --------
// Function to check if a page has elements
// --------

import { useStore } from "../hooks";

const store = useStore

export const fnPageHasElements = (store) => {
    const ids = store.pages
        .map((page) => page.children.map((child) => child.id))
        .flat();
    
    const hasObjects = ids?.length;

        if (hasObjects) return true;
        else return false;
}