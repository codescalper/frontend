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

  //   const handleFileChange = (event) => {
  // 		setFile(event.target.files[0]);
  // 		setFile(event.target.files[0]);
  //   };

  const handleRemoveBg = async () => {
    var varActivePageNo = 0;
    console.log("Handle upload START");

    //Fetch Image URL from the canvas
    // setFile(store.selectedElements[0].src);
    // console.log(file);

    // if (!file) return;

    const formData = new FormData();
    // formData.append('file', file);
    formData.append("url", store.selectedElements[0].src);

    // 03June2023
    // Find the index of the page for which thee removed background image needs to be placed
    store.pages.map((page) => {
      page.identifier == store._activePageId;
      // console.log("Index of the Page is ");
      // console.log(store.pages.indexOf(page));
      // setStActivePageNo(store.pages.indexOf(page));
      varActivePageNo = store.pages.indexOf(page);
    });

    try {
      const response = await axios.get(
        // BG REMOVE from Cutout.pro,

        // For File use this Endpoint
        // 'https://www.cutout.pro/api/v1/matting?mattingType=6',

        // For Image `src` URL as parameter , use this Endpoint
        `https://www.cutout.pro/api/v1/mattingByUrl?mattingType=6&url=${store.selectedElements[0].src}&crop=true`,

        // 'https://www.cutout.pro/api/v1/text2imageAsync',
        {
          headers: {
            APIKEY: "de13ee35bc2d4fbb80e9c618336b0f99",
            //  Backup API Keys :
            // 'APIKEY': 'c136635d69324c99942639424feea81a'
            // 'APIKEY': 'de13ee35bc2d4fbb80e9c618336b0f99' // rao2srinivasa@gmail.com
            // 'APIKEY': '63d61dd44f384a7c9ad3f05471e17130' //40 Credits
          },
        }
      );
      console.log(store.selectedElements[0].src);
      fnAddImageToCanvas(response?.data?.data?.imageUrl, varActivePageNo);
      
      // console.log("The S3 Res is ")
      fnStoreImageToS3(response?.data?.data?.imageUrl);
      
      // console.log("Deleting Previous images") // Under DEV - 08Jul2023
      // fnDeletePrevImage()
      return response?.data?.data?.imageUrl; //For to
    } catch (error) {
      console.error(error);
    }
    console.log("Handle upload END");
  };
  // Function to Add Removed BG image on the Canvas
  const fnAddImageToCanvas = (removedBgUrl, varActivePageNo) => {
    // Add the new removed Bg Image to the Page
    store.pages[stActivePageNo || varActivePageNo].addElement({
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

  const fnStoreImageToS3 = async (removedBgUrl) =>{

    // return console.log(removedBgUrl);

    const res = await getRemovedBgS3Link(removedBgUrl);
    if(res?.data){
      console.log(res.data);
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
