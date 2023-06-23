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
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useAccount } from "wagmi";
import {
  changeCanvasVisibility,
  deleteCanvasById,
  getAllCanvas,
  getCanvasById,
} from "../../services/backendApi";
import { toast } from "react-toastify";
import { Context } from "../../context/ContextProvider";

// Design card component start - 23Jun2023

const DesignCard = observer(
  ({ design, project, preview, json, onDelete, onPublic }) => {
    const [loading, setLoading] = useState(false);
    const { setCanvasId } = useContext(Context);
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
            setCanvasId(design.id);
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

    const loadImages = async () => {
      setIsLoading(true);
      const res = await getAllCanvas();
      
      if (res?.data) {
        setArrData(res?.data);
        arrMyDesigns.current = res?.data;
        setIsLoading(false);
      } else if (res?.error) {
        setIsError(res?.error);
        setIsLoading(false);
      }
    };

    const deleteCanvas = async (canvasId) => {
      const res = await deleteCanvasById(canvasId);
      if (res?.data) {
        toast.success(res?.data?.message);
        loadImages();
      } else if (res?.error) {
        toast.error(res?.error);
      }
    };

    const changeVisibility = async (canvasId) => {
      const res = await changeCanvasVisibility(canvasId, "public");
      if (res?.data) {
        toast.success(res?.data);
      } else if (res?.error) {
        toast.error(res?.error);
      }
    };

    const getSpecipifCanvas = async (id) => {
      setIsLoading(true);
      const res = await getCanvasById(id);
      if (res?.data) {
        // setData(res?.data);
        console.log(res?.data);
        setIsLoading(false);
      } else if (res?.error) {
        setIsError(res?.error);
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (isDisconnected) return;
      loadImages();
    }, [isConnected]);

    if (isDisconnected || !address) {
      return (
        <>
          <p>Please connect your wallet</p>
        </>
      );
    }

    if (isError) {
      return <div>{isError}</div>;
    }

    // Test - 23Jun2023
    // const arrDesign = [{design_id: 12, preview: "https://picsum.photos/300"}, {design_id: 23, preview: "https://picsum.photos/400"}]
    // console.log(arrDesign)

    return (
      <div className="h-full flex flex-col">
        <h1 className="text-lg">My Designs</h1>
        <Button> Create new design </Button>

        {/* New Design card start - 23Jun2023 */}
        {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
        {/* Pass these onto Line 25 */}
        <div className="flex flex-col overflow-y-scroll overflow-x-hidden h-full mt-6">
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
