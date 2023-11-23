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
import {
  ENVIRONMENT,
  checkDispatcher,
  createCanvas,
  getProfileData,
  updateCanvas,
} from "../../services";
import { Context } from "../../providers/context/ContextProvider";
import { unstable_setAnimationsEnabled } from "polotno/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  errorMessage,
  loadFile,
  base64Stripper,
  wait,
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../utils";
import { useTour } from "@reactour/tour";
import FcIdea from "@meronex/icons/fc/FcIdea";
import { useStore } from "../../hooks/polotno";
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
import { OnboardingSteps, OnboardingStepsWithShare } from "./common";
import { SpeedDialX } from "./common/elements/SpeedDial";
import { Tooltip } from "polotno/canvas/tooltip";
import { useSolanaWallet } from "../../hooks/solana";
import { LOCAL_STORAGE } from "../../data";
import { Button } from "@material-tailwind/react";
import { useAppAuth } from "../../hooks/app";

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
const CustomToolTipWrapper = () => {
  return <div>Test</div>;
};
const Editor = () => {
  const store = useStore();
  const height = useHeight();
  const { address, isConnected } = useAccount();
  const { solanaAddress } = useSolanaWallet();
  const { isAuthenticated } = useAppAuth();
  const isEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const isSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const currentUserAddress = getFromLocalStorage(LOCAL_STORAGE.userAddress);
  const getDispatcherStatus = getFromLocalStorage(LOCAL_STORAGE.dispatcher);
  const getLensAuth = getFromLocalStorage(LOCAL_STORAGE.lensAuth);
  const canvasIdRef = useRef(null);
  const timeoutRef = useRef(null);
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const {
    contextCanvasIdRef,
    setEnabled,
    setFastPreview,
    referredFromRef,
    lensCollectNftRecipientDataRef,
    assetsRecipientDataRef,
    nftRecipientDataRef,
    bgRemoverRecipientDataRef,
    preStoredRecipientDataRef,
    parentRecipientDataRef,
    parentRecipientListRef,
    canvasBase64Ref,
  } = useContext(Context);

  console.log(address, solanaAddress);

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

  // function to filter the recipient data
  const recipientDataFilter = () => {
    parentRecipientDataRef.current = [
      ...preStoredRecipientDataRef.current, // recipient data geting from BE
      ...lensCollectNftRecipientDataRef.current, // recipient data of lens collect
      ...assetsRecipientDataRef.current, // recipient data of assets
      ...nftRecipientDataRef.current, // recipient data of solana
      ...bgRemoverRecipientDataRef.current, // recipient data of bg remover
    ];

    const recipientDataRefArr = parentRecipientDataRef.current;

    // array of indexes for the elements that are not found
    const notFoundIndexes = [];

    // iterate through recipientDataRefArr and check if each element's id exists in the store by using store.getElementById(item.id).
    for (let i = 0; i < recipientDataRefArr.length; i++) {
      const item = recipientDataRefArr[i];
      const foundElement = store.getElementById(item.elementId);

      if (!foundElement) {
        notFoundIndexes.push(i);
      }
    }

    // Generate a new array by removing elements at notFoundIndexes
    const newDataRef = recipientDataRefArr.filter(
      (_, index) => !notFoundIndexes.includes(index)
    );

    // update the parentRecipientDataRef with the new array
    parentRecipientDataRef.current = newDataRef;

    // get the handles and address from the newArray
    const newArrayRecipients = newDataRef.map((item) => item.recipient);

    return {
      recipientsData: parentRecipientDataRef.current,
      recipients: newArrayRecipients,
    };
  };

  // function to add the all recipient handles / address
  const recipientDataCombiner = () => {
    // create an array of all the recipients then make it uniq

    let parentArray = [];

    // if the canvas is owned by other user
    if (referredFromRef.current.length > 0) {
      parentArray = [
        address || solanaAddress, // current recipient address
        referredFromRef.current[0], // owner address of other created canvas
        ...recipientDataFilter().recipients, // handles of all the dataRefs recipients
      ];
    } else {
      parentArray = [
        address || solanaAddress, // current recipient address
        ...recipientDataFilter().recipients, // handles of all the dataRefs recipients
      ];
    }

    // update the parentRecipientRef to the uniq values (final list for split revenue)
    parentRecipientListRef.current = [...new Set(parentArray)];

    return {
      recipients: parentRecipientListRef.current,
    };
  };

  // store the canvas and update it by traching the changes
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

      if (canvasChildren?.length === 0) {
        console.log("Canvas is empty. Its stopped saving");
        canvasIdRef.current = null;
        contextCanvasIdRef.current = null;
      }

      // save it to the backend
      if (canvasChildren?.length > 0) {
        // console.log("parentRecipientObj", recipientDataFilter().recipientsData);
        // console.log("parentRecipientRef", recipientDataCombiner().recipients);

        // return;

        // create new canvas
        if (!canvasIdRef.current) {
          createCanvasAsync({
            data: json,
            referredFrom: recipientDataCombiner().recipients,
            assetsRecipientElementData: recipientDataFilter().recipientsData,
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
              console.log("Canvas creation error", {
                error: errorMessage(err),
              });
            });
        }

        // update existing canvas
        if (canvasIdRef.current) {
          updateCanvasAsync({
            id: canvasIdRef.current,
            data: json,
            isPublic: false,
            referredFrom: recipientDataCombiner().recipients,
            assetsRecipientElementData: recipientDataFilter().recipientsData,
            preview: canvasBase64Ref.current,
          })
            .then((res) => {
              if (res?.status === "success") {
                console.log(res?.message);
              }
            })
            .catch((err) => {
              console.log("Canvas Update error", { error: errorMessage(err) });
            });
        }
      }
    }, 3000);
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

  //  check for dispatcher
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkDispatcherFn = async () => {
      try {
        const res = await checkDispatcher();
        if (res?.status === "success") {
          saveToLocalStorage(LOCAL_STORAGE.dispatcher, res?.message);
        } else {
          saveToLocalStorage(LOCAL_STORAGE.dispatcher, false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkDispatcherFn();
  }, [isAuthenticated]);

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
          {/* <PolotnoContainer className="min-h-screen md:min-h-full"> */}
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
              <Workspace
                store={store}
                components={{
                  Tooltip,
                  // Image: CustomToolTipWrapper
                }}
                backgroundColor="#e8e8ec"
              />

              {/* Bottom section */}
              <div className="mt-2 mb-2 mr-2 p-1/2 flex flex-row justify-between align-middle border border-black-300 rounded-lg ">
                <BgRemover />
                <ZoomButtons store={store} />

                {/* Quick Tour on the main page */}
                <div className="flex flex-row ">
                  {/* Speed Dial - Clear Canvas, etc.. Utility Fns */}
                  <SpeedDialX />

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
                    <div className="hidden md:block w-full m-2 ml-0 text-sm text-yellow-600">
                      Need an intro?
                    </div>
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
