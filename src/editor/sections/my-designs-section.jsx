import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteAPI } from "polotno/utils/use-api";

import { SectionTab } from "polotno/side-panel";

import { ImagesGrid } from "polotno/side-panel/images-grid";
import { TemplatesIcon } from "../editor-icon";

//Icons Import
import { Icon, IconSize, Button, Card, Menu, MenuItem, Position} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useAccount } from "wagmi";
import {
  deleteCanvasById,
  getAllCanvas,
  getCanvasById,
} from "../../services/backendApi";
import { toast } from "react-toastify";


// Design card component start - 23Jun2023


const DesignCard = observer(({ design, project, onDelete, preview, json }) => {
  const [loading, setLoading] = useState(false);
  const handleSelect = async () => {
    // setLoading(true);
    // await project.loadById(design.id);
    // project.store.openSidePanel('photos');
    // setLoading(false);
  };

  return (
    <Card
      style={{ margin: '3px', padding: '0px', position: 'relative' }}
      interactive
      onClick={() => {
        handleSelect();
      }}
    >
    <div className="" onClick={()=> store.loadJSON(json)} >
      <img src={preview} alt="preview IMG" style={{ width: '100%' }} />
    </div>

      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '3px',
        }}
      >
        {/* {design.name} */}
      </div>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner />
        </div>
      )}
      <div
        style={{ position: 'absolute', top: '5px', right: '5px' }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Popover2
          content={
            <Menu>
              <MenuItem
                icon="share"
                text="Share"
                onClick={() => {
                  // implement share function here
                }}
              />
              <MenuItem
                icon="globe"
                text="Make Public"
                onClick={async () => {
                  // implement make public function here
                }}
              />
              <MenuItem
                icon="trash"
                text="Delete"
                onClick={() => {
                  // implement delete function here
                }}
              />
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



export const MyDesignsPanel = observer(({ store, design, project, onDelete, json }) => {
  const { isDisconnected, address, isConnected } = useAccount();
  const [stMoreBtn, setStMoreBtn] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  
  const arrMyDesigns = useRef()
  const [arrData, setArrData] = useState([]);
  
  const loadImages = async () => {
    setIsLoading(true);
    const res = await getAllCanvas();
    setArrData(res.data);
    
    arrMyDesigns.current = res.data;
    
    console.log(arrData) 

    if (res?.data) {
      setData(res?.data);
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
    } else if (res?.error) {
      toast.error(res?.error);
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
  const arrDesign = [{design_id: 12, preview: "https://picsum.photos/300"}, {design_id: 23, preview: "https://picsum.photos/400"}]
  // console.log(arrDesign)
  
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg">My Designs</h1>
      <Button> Create new design </Button>

      <Popover2
        interactionKind="click"
        isOpen={stMoreBtn}
        renderTarget={({ isOpen, ref, ...targetProps }) => (
          <Button
            {...targetProps}
            elementRef={ref}
            onClick={() => setStMoreBtn(!stMoreBtn)}
            intent="none"
          >
            {" "}
            <Icon icon="more" />{" "}
          </Button>
        )}
        content={
          <div>
            <Button icon="document-open"> Share </Button>
            <Button onClick={() => deleteCanvas("4")} icon="trash">
              {" "}
              Delete{" "}
            </Button>
          </div>
        }
      />
      {/* <ImagesGrid
        shadowEnabled={false}
        images={data}
        getPreview={(item) => item?.imageLink != null && item?.imageLink[0]}
        isLoading={isLoading}
        onSelect={async (item) => {
          // download selected json
          const json = item.data;
          // const json = req.json();
          // just inject it into store
          store.loadJSON(json);
        }}
        rowsNumber={1}/>   */}

        
    {/* New Design card start - 23Jun2023 */} 
    {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
    {/* Pass these onto Line 25 */}
     {arrData.map((design)=> {
      return(
        
          <DesignCard
            design={design}
            json={design.data}
            preview={design.imageLink[0]}
            key={design.id}
            store={store}
            project={project}
            // onDelete={()=> {}}
          />
        )
      })}

     {/* New Design card end - 23Jun2023 */}

 
    </div>

  );
 });

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
