import React, { useContext, useEffect, useRef, useState } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import {
  SidePanel,
  DEFAULT_SECTIONS,
  // TemplatesSection,
  TextSection,
  BackgroundSection,
  UploadSection,
  LayersSection,
} from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { loadFile } from "./file";
import { CustomSizesPanel } from "./sections/resize-section";
import { BackgroundSection2 } from "./sections/backgrounds-section";
import { ShapesSection } from "./sections/shapes-section";
import { IconsSection } from "./sections/icons-section";
import { NFTSection } from "./sections/nft-section";
import { StableDiffusionSection } from "./sections/stable-diffusion-section";
import { MyDesignsSection } from "./sections/my-designs-section";
import { useProject } from "./project";

import Topbar from "./topbar/topbar";

import { TemplatesSection } from "./sections/templates-section";
import { useAccount } from "wagmi";
import {
  createCanvas,
  deleteCanvasById,
  getCanvasById,
  getRemovedBgS3Link,
  updateCanvas,
} from "../services/backendApi";
import { toast } from "react-toastify";

// New Imports :
import { Button } from "@blueprintjs/core";
import axios from "axios";
import { Context } from "../context/ContextProvider";
import { BACKEND_DEV_URL } from "../services/env";

const sections = [
  TemplatesSection,
  NFTSection,
  TextSection,
  MyDesignsSection,
  IconsSection,
  BackgroundSection,
  BackgroundSection2,
  ShapesSection,
  UploadSection,
  LayersSection,
  CustomSizesPanel,
  StableDiffusionSection,
];

const useHeight = () => {
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
    });
  }, []);
  return height;
};

const Editor = ({ store }) => {
  const project = useProject();
  const height = useHeight();
  const { address, isConnected } = useAccount();
  const canvasIdRef = useRef(null);
  const intervalRef = useRef(null);
  const { contextCanvasIdRef } = useContext(Context);

  const load = () => {
    let url = new URL(window.location.href);
    // url example https://studio.polotno.com/design/5f9f1b0b
    const reg = new RegExp("design/([a-zA-Z0-9_-]+)").exec(url.pathname);
    const designId = (reg && reg[1]) || "local";
    project.loadById(designId);
  };

  const handleDrop = (ev) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // skip the case if we dropped DOM element from side panel
    // in that case Safari will have more data in "items"
    if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
      return;
    }
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      loadFile(ev.dataTransfer.files[i], store);
    }
  };
  // ------ ai_integration branch
  // Cutout pro API start

  const [file, setFile] = useState(null);
  const [imgResponse, setImgResponse] = useState(null);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState("");
  const [stActivePageNo, setStActivePageNo] = useState(0);
  const [stShowRemoveBgBtn, setStShowRemoveBgBtn] = useState(false);
  var varActivePageNo = 0;
  //   const handleFileChange = (event) => {
  // 		setFile(event.target.files[0]);
  // 		setFile(event.target.files[0]);
  //   };

  const handleRemoveBg = async () => {
    const varImageUrl = store.selectedElements[0].src
    fnFindPageNo();

    var removedBgURL = await fnRemoveBg(varImageUrl);
    console.log(varActivePageNo);
    console.log(removedBgURL)

    // To Fix CORS error, we append the string with b-cdn url
    var cdnPrefix = "https://lenspost.b-cdn.net/"
    var newUrl = cdnPrefix + removedBgURL.slice(45) //Remove first 45 characters [s3 url]
    console.log(newUrl);

    fnAddImageToCanvas(`${newUrl}`, varActivePageNo)

    return removedBgURL;
  }
 

  // 03June2023

  // Find the index of the page for which the removed background image needs to be placed
  const fnFindPageNo = () => {
    store.pages.map((page) => {
    page.identifier == store._activePageId;
    setStActivePageNo(store.pages.indexOf(page));
    varActivePageNo = store.pages.indexOf(page);
  });
  }
    // Function to Add Removed BG image on the Canvas
  const fnAddImageToCanvas = async (removedBgUrl, varActivePageNo) => {
    // Add the new removed Bg Image to the Page
    console.log(removedBgUrl);

    await store.pages[stActivePageNo || varActivePageNo].addElement({
      type: "image",
      x: 0.5 * store.width,
      y: 0.5 * store.height,
      width: store.selectedElements[0].width,
      height: store.selectedElements[0].height,
      src: removedBgUrl,
      selectable: true,
      draggable: true,
      removable: true,
      resizable: true,
      showInExport: true,
    });
  };

  const fnRemoveBg = async (varImageUrl) =>{

    // return console.log(removedBgUrl);

    const res = await getRemovedBgS3Link(varImageUrl);
    if(res?.data){
      console.log(res.data);
      return res.data.s3link;
    }
    else if(res?.error) {
      console.log(res.error)
    }
  }

  // delete the Previous Image: - 26Jun2023
  const fnDeletePrevImage = async () =>{
    await store.deleteElements(store.selectedElements.map(x => x.id))
  }
  // Cutout pro API end

  //  Toast Setup
  const fnCallToast = async () => {
    const id = toast.loading("Removing Background", { autoClose: 4000 });
    const res = await handleRemoveBg();
    if (res) {
      toast.update(id, {
        render: "Removed Background", //Check if The toast is working
        type: "success",
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
      });
      console.log("res", res?.data);
    } else if (!res) {
      toast.update(id, {
        render: "Error in removing background",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
      });
    }
  };
  // create canvas
  useEffect(() => {
    const main = async () => {
      const storeData = store.toJSON();
      const canvasChildren = storeData.pages[0].children;

      if (canvasChildren.length === 0) {
        canvasIdRef.current = null;
        contextCanvasIdRef.current = null;
      }

      if (contextCanvasIdRef.current !== null) {
        canvasIdRef.current = contextCanvasIdRef.current;
      }

      if (canvasChildren.length > 0) {
        if (!canvasIdRef.current) {
          const res = await createCanvas(storeData, "hello", false);
          if (res?.data) {
            canvasIdRef.current = res?.data?.canvasId;
            contextCanvasIdRef.current = res?.data?.canvasId;
            console.log("Canvas created", { canvasId: res?.data?.canvasId });
          } else if (res?.error) {
            console.log("Canvas creation error", { error: res?.error });
          }
        }

        if (canvasIdRef.current) {
          const res = await updateCanvas(
            canvasIdRef.current,
            storeData,
            "hello",
            false
          );
          if (res?.data) {
            console.log(res?.data);
          } else if (res?.error) {
            console.log("Canvas update error", { error: res?.error });
          }
        }
      }
    };

    if (isConnected) {
      main(); // Fetch data initially

      intervalRef.current = setInterval(main, 5000); // Fetch data at regular intervals

      return () => {
        clearInterval(intervalRef.current); // Clear the interval when the component is unmounted
      };
    }
  }, [isConnected, store, address]);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: height + "px",
          display: "flex",
          flexDirection: "column",
        }}
        onDrop={handleDrop}
      >
        <div style={{ height: "calc(100% - 75px)" }}>
          <Topbar store={store} />
          <PolotnoContainer>
            <SidePanelWrap>
              <SidePanel store={store} sections={sections} />
            </SidePanelWrap>
            <WorkspaceWrap>
              <Toolbar store={store} />
              <Workspace store={store} />

              {/* ai_integration Start */}
              <div className="rf">
                <ZoomButtons store={store} />
                <Button icon="clean" onClick={fnCallToast} className="m-2 ml-6">
                  {" "}
                  Remove background{" "}
                </Button>
                {/* <Button onClick={fnDeletePrevImage}> Remove Element </Button> */}
              </div>

              {/* ai_integration End */}

              {/* <ZoomButtons store={store} /> */}
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
      </div>
    </>
  );
};

export default Editor;
