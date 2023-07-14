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
import { replaceImageURL } from "../services/replaceUrl";
import { unstable_setAnimationsEnabled } from "polotno/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fnMessege } from "../services/FnMessege";
import { wait } from "../utility/waitFn";

unstable_setAnimationsEnabled(true);

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
  const queryClient = useQueryClient();
  const { mutateAsync: createCanvasAsync } = useMutation({
    mutationKey: "createCanvas",
    mutationFn: createCanvas,
    onSuccess: () => {
      // queryClient.invalidateQueries(["my-designs"], { exact: true });
    },
  });

  const { mutateAsync: updateCanvasAsync } = useMutation({
    mutationKey: "createCanvas",
    mutationFn: updateCanvas,
    onSuccess: () => {
      // queryClient.invalidateQueries(["my-designs"], { exact: true });
    },
  });

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
    // // To Fix CORS error, we append the string with b-cdn url
    fnAddImageToCanvas(`${replaceImageURL(removedBgURL)}`, varActivePageNo)

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
    const res = await getRemovedBgS3Link(varImageUrl);
    if(res?.data){
      console.log(res.data);
      return res.data.s3link;
    }
  };

  // delete the Previous Image: - 26Jun2023
  const fnDeletePrevImage = async () => {
    await store.deleteElements(store.selectedElements.map((x) => x.id));
  };
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

  // store the canvas and update it by traching the changes start
  // write a function for throttle saving
  let timeout = null;
  const requestSave = () => {
    // if save is already requested - do nothing
    if (timeout) {
      return;
    }
    // schedule saving to the backend
    timeout = setTimeout(() => {
      // reset timeout
      timeout = null;
      // export the design
      const json = store.toJSON();

      const canvasChildren = json.pages[0].children;

      
      if (contextCanvasIdRef.current) {
        canvasIdRef.current = contextCanvasIdRef.current;
      }
      console.log({
        canvasIdRef: canvasIdRef.current,
        contextCanvasIdRef: contextCanvasIdRef.current,
      });

      if (canvasChildren.length === 0) {
        console.log("Canvas is empty. Its stopped from saving");
        canvasIdRef.current = null;
        contextCanvasIdRef.current = null;
      }

      // save it to the backend
      if (canvasChildren.length > 0) {
        if (!canvasIdRef.current) {
          createCanvasAsync({
            jsonCanvasData: json,
            followCollectModule: "canvas",
            isPublic: false,
          })
            .then((res) => {
              if (res?.status === "success") {
                console.log(res);
                canvasIdRef.current = res?.id;
                contextCanvasIdRef.current = res?.id;
                console.log(res?.message);
              }
            })
            .catch((err) => {
              console.log("Canvas creation error", { error: fnMessege(err) });
            });
        }

        if (canvasIdRef.current) {
          updateCanvasAsync({
            id: canvasIdRef.current,
            jsonCanvasData: json,
            followCollectModule: "canvas",
            isPublic: false,
          })
            .then((res) => {
              if (res?.status === "success") {
                console.log(res?.message);
              }
            })
            .catch((err) => {
              console.log("Canvas Update error", { error: fnMessege(err) });
            });
        }
      }
    }, 3000);
  };

  useEffect(() => {
    // request saving operation on any changes
    store.on("change", () => {
      requestSave();
    });
  }, []);

  // store the canvas and update it by traching the changes end

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
