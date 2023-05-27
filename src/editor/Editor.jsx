import React, { useEffect, useRef, useState } from "react";
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
  updateCanvas,
} from "../services/backendApi";

const sections = [
  TemplatesSection,
  NFTSection,
  TextSection,
  MyDesignsSection,
  IconsSection,
  BackgroundSection,
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
  const { address } = useAccount();
  const [canvasId, setCanvasId] = useState();
  const canvasIdRef = useRef(null);

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

  useEffect(() => {
    const fetchData = async () => {
      // Place the async logic here
      const storeData = store.toJSON();
      const canvasChildren = storeData.pages[0].children;

      // console.log("children", canvasChildren.length)
      // return
      if (canvasChildren.length === 0) {
        canvasIdRef.current = null;
      }

      if (canvasChildren.length > 0) {
        if (!canvasIdRef.current) {
          const res = await createCanvas(storeData, "hello", false);
          canvasIdRef.current = res.canvasId;
          // setCanvasId(res.canvasId);
          console.log("create canvas", res.canvasId);
        }

        if (canvasIdRef.current) {
          const res = await updateCanvas(
            canvasIdRef.current,
            storeData,
            "hello",
            false
          );
          console.log("update canvas", res);
        }
      }
    };

    const interval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const saveCanvas = async () => {
    console.log(store.toJSON());
    const res = await createCanvas(store.toJSON(), "hello", false);
    console.log(res);
  };

  const getCanvas = async () => {
    const res = await getCanvasById("40");
    console.log(res);
  };

  const deleteCanvas = async () => {
    const res = await deleteCanvasById("");
    console.log("deleted");
  };

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
          <button onClick={saveCanvas} className="mr-5">
            Save
          </button>
          <button onClick={getCanvas} className="mr-5">
            Get
          </button>
          <button onClick={deleteCanvas}>Delete</button>
          <PolotnoContainer>
            <SidePanelWrap>
              <SidePanel store={store} sections={sections} />
            </SidePanelWrap>
            <WorkspaceWrap>
              <Toolbar store={store} />
              <Workspace store={store} />
              <ZoomButtons store={store} />
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
      </div>
    </>
  );
};

export default Editor;
