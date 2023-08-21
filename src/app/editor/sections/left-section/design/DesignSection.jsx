import React, { useContext, useEffect, useRef, useState } from "react";

import { SectionTab } from "polotno/side-panel";
import { MyDesignIcon, TemplatesIcon } from "../../../../../assets";

import {
  Button,
  Card,
  Menu,
  MenuItem,
  Position,
  Spinner,
} from "@blueprintjs/core";

import { Popover2 } from "@blueprintjs/popover2";
import { useAccount } from "wagmi";
import {
  changeCanvasVisibility,
  deleteCanvasById,
  getAllCanvas,
  getUserPublicTemplates,
} from "../../../../../services";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  CompModal,
  ConnectWalletMsgComponent,
  ErrorComponent,
  MessageComponent,
  MyDesignReacTour,
  SearchComponent,
} from "../../../common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "../../../../../hooks";
import { Context } from "../../../../../context/ContextProvider";
import { fnMessage, replaceImageURL } from "../../../../../utils";

// Design card component start - 23Jun2023

const DesignCard = ({
  design,
  preview,
  json,
  onDelete,
  onPublic,
  isPublic,
  openTokengateModal,
}) => {
  const [loading, setLoading] = useState(false);
  const { fastPreview, contextCanvasIdRef } = useContext(Context);
  const store = useStore();

  return (
    <Card
      className="relative p-0 m-1 rounded-lg"
      interactive
      onDragEnd={() => {
        store.loadJSON(json);
        contextCanvasIdRef.current = design.id;
      }}
      onClick={() => {
        store.loadJSON(json);
        contextCanvasIdRef.current = design.id;
      }}
    >
      <div className="rounded-lg overflow-hidden">
        <LazyLoadImage
          placeholderSrc={replaceImageURL(preview)}
          effect="blur"
          src={
            contextCanvasIdRef.current === design.id ? fastPreview[0] : preview
          }
          alt="Preview Image"
        />
      </div>

      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          // padding: "3px",
        }}
      >
        {/* {design.name} */}
      </div>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spinner />
        </div>
      )}
      <div
        style={{ position: "absolute", top: "5px", right: "5px" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Popover2
          content={
            <Menu>
              {/* <MenuItem
                  icon="share"
                  text="Share"
                  onClick={() => {
                    // implement share function here
                  }}
                /> */}
              <MenuItem
                icon="globe"
                text={isPublic(design.id) ? "Make Private" : "Make Public"}
                onClick={onPublic}
              />
              <MenuItem
                icon="layout-circle"
                text="Tokengate & Make Public"
                onClick={openTokengateModal}
              />
              <MenuItem icon="trash" text="Delete" onClick={onDelete} />
            </Menu>
          }
          position={Position.BOTTOM}
        >
          <div id="makePublic">
            <Button icon="more" />
          </div>
        </Popover2>
      </div>
    </Card>
  );
};

// Design card component end - 23Jun2023

export const DesignPanel = ({ store }) => {
  const { fastPreview, contextCanvasIdRef } = useContext(Context);
  const { isDisconnected, address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  // const [stConfirmNew, setStConfirmNew] = useState("");
  const [query, setQuery] = useState("");

  const [openTokengateModal, setOpenTokengateModal] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-designs"],
    queryFn: getAllCanvas,
  });

  const { data: publicTemplates } = useQuery({
    queryKey: ["user-templates"],
    queryFn: getUserPublicTemplates,
  });

  const {
    mutate: deleteCanvas,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationKey: "delete-canvas",
    mutationFn: deleteCanvasById,
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["my-designs"], { exact: true });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const {
    mutate: changeVisibility,
    isError: isVisibilityError,
    error: visibilityError,
  } = useMutation({
    mutationKey: "change-visibility",
    mutationFn: changeCanvasVisibility,
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["user-templates"], { exact: true });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // funtion to check if canvas is public or not
  const isCanvasPublic = (canvasId) => {
    if (publicTemplates) {
      return publicTemplates.some((obj) => obj.id === canvasId);
    }
    return false;
  };

  // Function to delete all the canvas on confirmation - 25Jun2023
  const fnDeleteCanvas = () => {
    store.clear({ keepHistory: true });
    store.addPage();
    setIsOpen(false);
  };

  // Function to make the canvas public & also Tokengated
  const fnTokengateDesign = () => {
    console.log(document.getElementById("iDTokengateDesign").value);
    // use this to fetch input field data : -
    // document.getElementById("iDTokengateDesign").value

    setOpenTokengateModal(!openTokengateModal);
  };

  useEffect(() => {
    if (isDeleteError) {
      toast.error(fnMessage(deleteError));
    } else if (isVisibilityError) {
      toast.error(fnMessage(visibilityError));
    }
  }, [isDeleteError, isVisibilityError]);

  if (isDisconnected || !address) {
    return (
      <div className="h-full flex flex-col">
        <ConnectWalletMsgComponent />
      </div>
    );
  }

  // Show Loading - 06Jul2023
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg">My Files</h1>

      <Button
        className="m-2 p-1"
        onClick={() => {
          const ids = store.pages
            .map((page) => page.children.map((child) => child.id))
            .flat();
          const hasObjects = ids?.length;

          if (hasObjects) {
            setIsOpen(!isOpen);
            // isOpen(true);
          }
        }}
      >
        Create new design
      </Button>
      {openTokengateModal && (
        <CompModal
          openTokengateModal
          tokengatingIp="contract address / Lenster post link"
          // store={store}
          icon={"lock"}
          ModalTitle={"Tokengate this template"}
          ModalMessage={`
          Please enter the Contract Address or the Lenster Post Link to tokengate this template.
          `}
          customBtn={"Confirm"}
          onClickFunction={fnTokengateDesign}
        />
      )}
      {isOpen && (
        <CompModal
          ModalTitle={"Are you sure to create a new design?"}
          ModalMessage={"This will remove all the content from your canvas"}
          onClickFunction={() => fnDeleteCanvas()}
        />
      )}
      <SearchComponent
        onClick={false}
        query={query}
        setQuery={setQuery}
        placeholder="Search designs by id"
      />
      <MyDesignReacTour />
      {/* This is the Modal that Appears on the screen for Confirmation - 25Jun2023 */}

      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {isError ? (
        <ErrorComponent error={error} />
      ) : data.length > 0 ? (
        <div className="overflow-y-auto grid grid-cols-2" id="RecentDesigns">
          {data.map((design) => {
            return (
              <DesignCard
                design={design}
                json={design.data}
                preview={
                  design?.imageLink != null &&
                  design?.imageLink.length > 0 &&
                  design?.imageLink[0]
                }
                key={design.id}
                onDelete={() => deleteCanvas(design.id)}
                onPublic={() =>
                  isCanvasPublic(design.id)
                    ? changeVisibility({ id: design.id, isPublic: false })
                    : changeVisibility({ id: design.id, isPublic: true })
                }
                isPublic={isCanvasPublic}
                openTokengateModal={() =>
                  setOpenTokengateModal(!openTokengateModal)
                }
              />
            );
          })}
          {contextCanvasIdRef.current === null && fastPreview[0] && (
            <Card className="relative p-0 m-1" interactive>
              <img src={fastPreview[0]} alt="" />
            </Card>
          )}
        </div>
      ) : (
        <div id="RecentDesigns">
          <MessageComponent message="You have not created any design yet" />
        </div>
      )}

      {/* New Design card end - 23Jun2023 */}
    </div>
  );
};

// define the new custom section
const DesignSection = {
  name: "My Designs",
  Tab: (props) => (
    <SectionTab name="My Files" {...props}>
      <MyDesignIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: DesignPanel,
};

export default DesignSection;
