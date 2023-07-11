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
  Spinner,
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
import {
  ConnectWalletMsgComponent,
  ErrorComponent,
  SearchComponent,
} from "../../elements";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["my-designs"],
      queryFn: getAllCanvas,
    });
    const deleteCanvas = useMutation({
      mutationKey: "delete-canvas",
      mutationFn: deleteCanvasById,
      onSuccess: (data) => {
        toast.success(data?.message);
      },
      onError: (error) => {
        toast.error(error);
      },
    });
    const { isDisconnected, address, isConnected } = useAccount();
    const [stOpenedModal, setStOpenedModal] = useState(false);
    const [stConfirmNew, setStConfirmNew] = useState("");
    const [query, setQuery] = useState("");

    // const deleteCanvas = async (id) => {
    //   const res = await deleteCanvasById(id);
    //   if (res?.data) {
    //     toast.success(res?.data?.message);
    //     loadImages();
    //   } else if (res?.error) {
    //     toast.error(res?.error);
    //   }
    // };

    const changeVisibility = async (id) => {
      const res = await changeCanvasVisibility(id, true);
      if (res?.data) {
        toast.success(res?.data);
      } else if (res?.error) {
        toast.error(res?.error);
      }
    };

    if (isDisconnected || !address) {
      return <ConnectWalletMsgComponent />;
    }

    // Show Loading - 06Jul2023
    if (isLoading) {
      return (
        <div className="flex flex-col">
          <Spinner />
        </div>
      );
    }

    // Function to delete all the canvas on confirmation - 25Jun2023
    const fnDeleteCanvas = () => {
      const pagesIds = store.pages.map((p) => p.id);
      store.deletePages(pagesIds);
      store.addPage();
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

        <SearchComponent onClick={false} query={query} setQuery={setQuery} />

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
          <ErrorComponent message={error} />
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
                  onDelete={() => deleteCanvas.mutate(design.id)}
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
