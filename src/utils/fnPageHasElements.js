// --------
// Function to check if a page has elements
// --------

import { useStore } from "../hooks";

const store = useStore()

export const fnPageHasElements = () => {
     
    // If Canvas has pages then,

    // const ids = store.pages
    //     .map((page) => page.children.map((child) => child.id))
    //     .flat();
    
    // const hasObjects = ids?.length;
    // console.log(store.activePage.children.length)

    if(store.activePage.children.length > 0){
        console.log("true")
        return true;
    } 
    else return false;
}