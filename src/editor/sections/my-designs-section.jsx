import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import { SectionTab } from "polotno/side-panel";
import { TemplatesIcon } from "../editor-icon";

//Icons Import

import {
  Icon,
  IconSize,
  Button,
  Card,
  Menu,
  MenuItem,
  Position,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@blueprintjs/core";

import { Popover2 } from "@blueprintjs/popover2";
import { useAccount } from "wagmi";
import {
  changeCanvasVisibility,
  deleteCanvasById,
  getAllCanvas,
  getCanvasById,
} from "../../services/backendApi";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../../context/ContextProvider";

// Design card component start - 23Jun2023

const DesignCard = observer(
  ({ design, project, preview, json, onDelete, onPublic }) => {
    const [loading, setLoading] = useState(false);
    const { contextCanvasIdRef } = useContext(Context);
    const handleSelect = async () => {
      // setLoading(true);
      // await project.loadById(design.id);
      // project.store.openSidePanel('photos');
      // setLoading(false);
    };

    return (
      <Card
        style={{ margin: "3px", padding: "0px", position: "relative" }}
        interactive
        onClick={() => {
          handleSelect();
        }}
      >
        <div
          className=""
          onClick={() => {
            contextCanvasIdRef.current = design.id;
            store.loadJSON(json);
          }}
        >
          <img src={preview} alt="preview IMG" style={{ width: "100%" }} />
        </div>

        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "3px",
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
                <MenuItem icon="globe" text="Make Public" onClick={onPublic} />
                <MenuItem icon="trash" text="Delete" onClick={onDelete} />
              </Menu>
            }
            position={Position.BOTTOM}
          >
            <Button icon="more" />
          </Popover2>
        </div>
      </Card>
    );
  }
);

// Design card component end - 23Jun2023

export const MyDesignsPanel = observer(
  ({ store, design, project, onDelete, json }) => {
    const { isDisconnected, address, isConnected } = useAccount();
    const [stMoreBtn, setStMoreBtn] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");

    const arrMyDesigns = useRef();
    const [arrData, setArrData] = useState([]);
    const [stOpenedModal, setStOpenedModal] = useState(false);
    const [stConfirmNew, setStConfirmNew] = useState("");

    const loadImages = async () => {
      setIsLoading(true);
      const res = await getAllCanvas();

      if (res?.data) {
        setArrData(res.data);
        arrMyDesigns.current = res.data;
        setData(res?.data);
        setIsLoading(false);
      } else if (res?.error) {
        setIsError(res?.error);
        setIsLoading(false);
      }
    };

    const deleteCanvas = async (id) => {
      const res = await deleteCanvasById(id);
      if (res?.data) {
        toast.success(res?.data?.message);
        loadImages();
      } else if (res?.error) {
        toast.error(res?.error);
      }
    };

    const changeVisibility = async (id) => {
      const res = await changeCanvasVisibility(id);
      if (res?.data) {
        toast.success(res?.data);
        loadImages();
      } else if (res?.error) {
        toast.error(res?.error);
      }
    };

    useEffect(() => {
      console.log("useEffect");
      if (isDisconnected) return;
      loadImages();
    }, [isConnected]);

    if (isError) {
      return <div>{isError}</div>;
    }

    if (isDisconnected || !address) {
      return (
        <>
          <p>Please connect your wallet</p>
        </>
      );
    }

    // Test - 23Jun2023
    // const arrDesign = [
    //   { design_id: 12, preview: "https://picsum.photos/300" },
    //   { design_id: 23, preview: "https://picsum.photos/400" },
    // ];
    // console.log(arrDesign)

    // Function to delete all the canvas on confirmation - 25Jun2023
    const fnDeleteCanvas = () => {
      const pagesIds = store.pages.map((p) => p.id);
      store.deletePages(pagesIds);
      store.addPage();
      // project.id = '';
      // project.save();

      // close the Modal/Dialog
      setStOpenedModal(!stOpenedModal);
    };

    return (
      <div className="h-full flex flex-col">
        <h1 className="text-lg">My Designs</h1>

        <Button
          onClick={() => {
            const ids = store.pages
              .map((page) => page.children.map((child) => child.id))
              .flat();
            const hasObjects = ids?.length;

            if (hasObjects) {
              setStOpenedModal(true);
              if (stConfirmNew) {
                return;
              }
            }
          }}
        >
          {" "}
          Create new design{" "}
        </Button>

        {/* This is the Modal that Appears on the screen for Confirmation - 25Jun2023 */}

        <Dialog
          title="Are you sure to create a new design?"
          icon="info-sign"
          isOpen={stOpenedModal}
          canOutsideClickClose="true"
          onClose={() => {
            setStOpenedModal(!stOpenedModal);
          }}
        >
          <DialogBody>This will remove all the content.</DialogBody>
          <DialogFooter
            actions={
              <div>
                <Button
                  intent="danger"
                  text="Yes"
                  onClick={() => {
                    fnDeleteCanvas();
                  }}
                />
                <Button
                  text="No"
                  onClick={() => {
                    setStOpenedModal(false);
                  }}
                />
              </div>
            }
          />
        </Dialog>

        {/* New Design card start - 23Jun2023 */}
        {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
        {/* Pass these onto Line 25 */}
        {arrData.length === 0 ? (
          <div className="flex justify-center items-center">
            <div className="text-center">
              <p className="text-gray-500 text-sm mt-4">
                You have not created any designs yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto">
            {arrData.map((design) => {
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
                  store={store}
                  project={project}
                  onDelete={() => deleteCanvas(design.id)}
                  onPublic={() => changeVisibility(design.id)}
                />
              );
            })}
          </div>
        )}

        {/* New Design card end - 23Jun2023 */}
      </div>
    );
  }
);

// define the new custom section
export const MyDesignsSection = {
  name: "My Designs",
  Tab: (props) => (
    <SectionTab name="My Designs" {...props}>
      <TemplatesIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: MyDesignsPanel,
};
