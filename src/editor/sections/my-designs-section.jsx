import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import { SectionTab } from "polotno/side-panel";
import { TemplatesIcon } from "../editor-icon";

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
} from "../../services/backendApi";
import { toast } from "react-toastify";
import { Context } from "../../context/ContextProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { replaceImageURL } from "../../services/replaceUrl";
import { ConnectWalletMsgComponent, ErrorComponent } from "../../elements";

// Design card component start - 23Jun2023

const DesignCard = observer(({ design, preview, json, onDelete, onPublic }) => {
  const [loading, setLoading] = useState(false);
  const { contextCanvasIdRef } = useContext(Context);

  return (
    <Card
      style={{ margin: "4px", padding: "0px", position: "relative" }}
      interactive
      onDragEnd={() => {
        store.loadJSON(json);
      }}
      onClick={() => {
        store.loadJSON(json);
        contextCanvasIdRef.current = design.id;
      }}
    >
      <div className="">
        <LazyLoadImage
          placeholderSrc={replaceImageURL(preview)}
          effect="blur"
          height={150}
          width={150}
          src={replaceImageURL(preview)}
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
});

// Design card component end - 23Jun2023

export const MyDesignsPanel = observer(
  ({ store, design, project, onDelete, json }) => {
    const { isDisconnected, address, isConnected } = useAccount();
    const [stMoreBtn, setStMoreBtn] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [stOpenedModal, setStOpenedModal] = useState(false);
    const [stConfirmNew, setStConfirmNew] = useState("");

    const loadImages = async () => {
      setIsLoading(true);
      const res = await getAllCanvas();
      if (res?.data) {
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
      const res = await changeCanvasVisibility(id, true);
      if (res?.data) {
        toast.success(res?.data);
        loadImages();
      } else if (res?.error) {
        toast.error(res?.error);
      }
    };

    useEffect(() => {
      if (isDisconnected) return;
      loadImages();
    }, [isConnected]);

    if (isDisconnected || !address) {
      return <ConnectWalletMsgComponent />;
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
          className="m-2 p-1"
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
        {/*   Pass these onto Line 25 */}
        {isError ? (
          <ErrorComponent message={isError} />
        ) : data.length === 0 ? (
          <ErrorComponent message="You have not created any design" />
        ) : (
          <div className="overflow-y-auto grid grid-cols-2">
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
