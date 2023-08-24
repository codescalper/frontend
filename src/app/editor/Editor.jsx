import React, { useContext, useEffect, useRef } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import {
  SidePanel,
  TextSection,
  BackgroundSection,
  LayersSection,
} from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { useAccount } from "wagmi";
import { createCanvas, updateCanvas } from "../../services";
import { Context } from "../../context/ContextProvider";

import { unstable_setAnimationsEnabled } from "polotno/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFromLocalStorage,
  fnMessage,
  loadFile,
  base64Stripper,
} from "../../utils";
import { useTour } from "@reactour/tour";
import FcIdea from "@meronex/icons/fc/FcIdea";
import { useStore } from "../../hooks";
import { TopbarSection } from "./sections/top-section";
import {
  AIImageSection,
  BannerSection,
  DesignSection,
  NFTSection,
  ResizeSection,
  ShapeSection,
  StickerSection,
  TemplateSection,
  UploadSection,
} from "./sections/left-section";
import { BgRemover } from "./sections/bottom-section";

// enable animations
unstable_setAnimationsEnabled(true);

const sections = [
  NFTSection,
  TemplateSection,
  TextSection,
  DesignSection,
  StickerSection,
  BannerSection,
  AIImageSection,
  BackgroundSection,
  ShapeSection,
  UploadSection,
  LayersSection,
  ResizeSection,
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

const Editor = () => {
  const store = useStore();
  const height = useHeight();
  const { address, isConnected } = useAccount();
  const canvasIdRef = useRef(null);
  const canvasBase64Ref = useRef([]);
  const {
    contextCanvasIdRef,
    setEnabled,
    setFastPreview,
  } = useContext(Context);
  const timeoutRef = useRef(null);
  const { setSteps, setIsOpen, setCurrentStep } = useTour();

  const handleDrop = (ev) => {
    // Do not load the upload dropzone content directly to canvas
    // Avoids Duplication issue
    if (store.openedSidePanel == "Upload") {
      return;
    }
    console.log(store.openedSidePanel);
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

  const queryClient = useQueryClient();
  const { mutateAsync: createCanvasAsync } = useMutation({
    mutationKey: "createCanvas",
    mutationFn: createCanvas,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-designs"], { exact: true });
    },
  });

  const { mutateAsync: updateCanvasAsync } = useMutation({
    mutationKey: "createCanvas",
    mutationFn: updateCanvas,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-designs"], { exact: true });
    },
  });
  // 03June2023

  // store the canvas and update it by traching the changes start
  const requestSave = () => {
    // if save is already requested - do nothing
    if (timeoutRef.current) {
      return;
    }

    // schedule saving to the backend
    timeoutRef.current = setTimeout(async () => {
      // reset timeout
      timeoutRef.current = null;

      // export the design
      const json = store.toJSON();

      const canvasChildren = json.pages[0]?.children;
      if (contextCanvasIdRef.current) {
        canvasIdRef.current = contextCanvasIdRef.current;
      }
      // console.log({
      //   canvasIdRef: canvasIdRef.current,
      //   contextCanvasIdRef: contextCanvasIdRef.current,
      // });

      if (canvasChildren?.length === 0) {
        console.log("Canvas is empty. Its stopped from saving");
        canvasIdRef.current = null;
        contextCanvasIdRef.current = null;
      }

      // save it to the backend
      if (canvasChildren?.length > 0) {
        if (!canvasIdRef.current) {
          createCanvasAsync({
            data: json,
            preview: canvasBase64Ref.current,
          })
            .then((res) => {
              if (res?.status === "success") {
                canvasIdRef.current = res?.id;
                contextCanvasIdRef.current = res?.id;
                console.log(res?.message);
              }
            })
            .catch((err) => {
              console.log("Canvas creation error", { error: fnMessage(err) });
            });
        }

        if (canvasIdRef.current) {
          updateCanvasAsync({
            id: canvasIdRef.current,
            data: json,
            isPublic: false,
            preview: canvasBase64Ref.current,
          })
            .then((res) => {
              if (res?.status === "success") {
                lastSavedJsonRef.current = json;
                console.log(res?.message);
              }
            })
            .catch((err) => {
              console.log("Canvas Update error", { error: fnMessage(err) });
            });
        }
      }
    }, 5000);
  };

  useEffect(() => {
    // request saving operation on any changes
    const handleChange = () => {
      requestSave();
    };

    // Add the change event listener
    const off = store.on("change", handleChange);

    // Clean up the event listener on unmount
    return () => {
      off();
    };
  }, []);

  // store the canvas and update it by traching the changes end

  // default split revenue recipient
  useEffect(() => {
    // if wallet is connected set the recipient address only in the first index for the first time
    if (isConnected) {
      setEnabled((prevEnabled) => ({
        ...prevEnabled,
        splitRevenueRecipients: [
          { recipient: "@lenspostxyz.lens", split: 10.0 },
          { recipient: address, split: 90.0 },
          ...prevEnabled.splitRevenueRecipients.slice(2),
        ],
      }));
    }
  }, [address]);

  // funtion for fast preview
  useEffect(() => {
    const requestSave = async () => {
      const json = store.toJSON();
      const canvasChildren = json.pages[0]?.children;

      if (canvasChildren?.length === 0) {
        contextCanvasIdRef.current = null;
        canvasBase64Ref.current = [];
        setFastPreview("");
      } else {
        // check if the canvas has more than 1 page
        if (store.pages.length > 0) {
          // if yes, get the base64 for all the pages
          let previewBase64Arr = [];
          let storeBase64Arr = [];
          for (let i = 0; i < store.pages.length; i++) {
            const imgBase64 = await store.toDataURL({
              pageId: store.pages[i].id,
            });

            // remove data:image/png;base,
            const imgBase64Stripped = base64Stripper(imgBase64);

            storeBase64Arr.push(imgBase64Stripped);
            previewBase64Arr.push(imgBase64);
          }
          canvasBase64Ref.current = storeBase64Arr;
          setFastPreview(previewBase64Arr);
        }
      }
    };

    // request saving operation on any changes
    const handleChange = () => {
      requestSave();
    };

    // Add the change event listener
    const off = store.on("change", handleChange);

    // Clean up the event listener on unmount
    return () => {
      off();
    };
  }, []);

  return (
    <>
      <div
        className=""
        style={{
          width: "100vw",
          height: height + "px",
          display: "flex",
          flexDirection: "column",
        }}
        onDrop={handleDrop}
      >
        <div style={{ height: "calc(100% - 75px)" }}>
          <div className="">
            <TopbarSection />
          </div>
          <PolotnoContainer>
            <div id="second-step" className="mx-2">
              <SidePanelWrap>
                <SidePanel store={store} sections={sections} />
              </SidePanelWrap>
            </div>
            <WorkspaceWrap>
              <div className="mb-2 mr-2">
                <Toolbar store={store} />
              </div>
              <Workspace store={store} />

              {/* Bottom section */}
              <div className="mt-2 mb-2 mr-2 p-1/2 flex flex-row justify-between align-middle border border-black-300 rounded-lg">
                <BgRemover />
                <ZoomButtons store={store} />

                {/* Quick Tour on the main page */}
                <div
                  className="m-1 ml-2 flex flex-row justify-end align-middle cursor-pointer"
                  onClick={async () => {
                    setCurrentStep(0);
                    if (isConnected) {
                      setIsOpen(true);
                      setSteps(OnboardingStepsWithShare);
                    } else {
                      setIsOpen(true);
                      setSteps(OnboardingSteps);
                    }
                  }}
                >
                  <FcIdea className="m-2" size="16" />{" "}
                  <div className="m-2 ml-0 text-sm text-yellow-600">
                    Need an intro?
                  </div>
                </div>
              </div>
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
      </div>
    </>
  );
};

export default Editor;
