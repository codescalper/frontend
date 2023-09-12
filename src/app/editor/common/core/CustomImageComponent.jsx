// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Button,
  Card,
  Menu,
  MenuItem,
  Position,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { replaceImageURL } from "../../../../utils/replaceUrl";
import { useEffect, useState } from "react";
import { useStore } from "../../../../hooks";
import { fnPageHasElements } from "../../../../utils/fnPageHasElements"
import CompModal from "../modals/ModalComponent";
import { useContext } from "react";
import { Context } from "../../../../context/ContextProvider";
import { fnLoadJsonOnPage } from "../../../../utils";

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({
  preview,
  dimensions,
  isBackground,
  hasOptionBtn,
  onDelete,
  isLensCollect,
  featuredWallet,
  changeCanvasDimension,
  json
}) => {
  const store = useStore();
  const [base64Data, setBase64Data] = useState("");
  const { referredFromRef } = useContext(Context);
  
  const [modal, setModal] = useState({
    isOpen: false,
    isTokengate: false,
    isNewDesign: false,
    stTokengateIpValue: "",
    isError: false,
    errorMsg: "",
    canvasId: null,
  });

  // convert to base64
  const getBase64 = async (image) => {
    const response = await fetch(image);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(`data:image/svg+xml;base64,${base64String}`);
      };
      reader.readAsDataURL(blob);
    });
  };

  // funtion to check if preview has .svg extension
  const isSVG = (image) => {
    return image?.includes(".svg");
  };

  // Function to add image on the Canvas/Page
  const fnAddImageOnCanvas = () => {
    {!json &&

    // Instead of `isBackground`, use `changeCanvasDimension`
  
    changeCanvasDimension && store.setSize(dimensions[0], dimensions[1]);

    // if nft is a lens collect, add it to the referredFromRef but check if a handle is already
    if (isLensCollect?.isLensCollect) {
      if (!referredFromRef.current.includes(isLensCollect?.lensHandle)) {
        referredFromRef.current.push(isLensCollect?.lensHandle);
      }
    }

    var widthOnCanvas = 400;
    var heightOnCanvas = 400;

    if(dimensions && dimensions[0] && dimensions[1]){
      console.log("dimensions", dimensions);
      
      widthOnCanvas = dimensions[0] /4 ;
      heightOnCanvas = dimensions[1] /4 ;
    }
    // else {
    //   widthOnCanvas = 400;
    //   heightOnCanvas = 400;
    // }
    
    store.activePage?.addElement({
      type: "image",
      src: base64Data, //Image URL
      width: changeCanvasDimension ? store.width : widthOnCanvas,
      height: changeCanvasDimension ? store.height : heightOnCanvas,
      x: changeCanvasDimension ? 0 : store.width / 4,
      y: changeCanvasDimension ? 0 : store.height / 4,
    });
  
  }

    // if any json data is present, load it on the canvas
    {json && 
      // if()
      fnLoadJsonOnPage(store, json);
    }
  }

  // Function for drop/add image or template on canvas
  const handleClickOrDrop = () => {
    console.log(fnPageHasElements());

    // if page has elements and if we should replace it with another template, show modal
    if(fnPageHasElements() && json){
      // console.log("Page has elements");
      setModal({ ...modal, isOpen: true });
      // fnAddImageOnCanvas();
      // e.stopPropagation();
    }
    // if page has elements and if we should place an image, but not template
    else if(fnPageHasElements() && !json){
      // console.log("Page has no elements");
      fnAddImageOnCanvas();
    }
    else {
      fnAddImageOnCanvas();
    }
    
};

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const image = await getBase64(replaceImageURL(preview));
        setBase64Data(image);
      } catch (error) {
        console.error("Error fetching or converting the image:", error);
      }
    };

    if (isSVG(replaceImageURL(preview))) {
      fetchImage();
    } else {
      setBase64Data(replaceImageURL(preview));
    }
  }, [preview]);

  return (<>
  
    <Card
      className="relative p-0 m-1 rounded-lg h-fit"
      interactive
      onDragEnd={handleClickOrDrop}
      onClick={handleClickOrDrop}
    >
      <div className="rounded-lg overflow-hidden">
        <LazyLoadImage
          placeholderSrc={base64Data}
          effect="blur"
          src={base64Data}
          alt="Preview Image"
        />
      </div>   

      {/* if nft is a lens collect */}
      {isLensCollect?.isLensCollect && (
        <>
          <div
            title="Collected from Lens"
            // className="bg-[#E1F26C] p-1 rounded-lg absolute top-2 left-2 opacity-60 hover:opacity-100"
            className="text-white text-xs bg-[#161616] px-2 py-0.5 rounded-md absolute top-2 right-2 opacity-96 hover:opacity-80"
            onClick={(e) => { 
              e.stopPropagation();

              const onlyHandle = isLensCollect?.lensHandle.split("@")[1];
              window.open(`https://lenster.xyz/u/${onlyHandle}`, "_blank");
            }}
          >
            {isLensCollect?.lensHandle}
          </div>
        </>
      )}

      {/* Wallet Address on Featured BGs */}

      {featuredWallet && (
        <>
          <div
            title="Collected from Lens"
            // className="bg-[#E1F26C] p-1 rounded-lg absolute top-2 left-2 opacity-60 hover:opacity-100"
            className="text-white text-xs bg-[#161616] px-2 py-0.5 rounded-md absolute top-2 right-2 opacity-96 hover:opacity-80"
            onClick={(e) => { 
              e.stopPropagation();
              const onlyHandle = isLensCollect?.lensHandle.split("@")[1];
              window.open(`https://lenster.xyz/u/${featuredWallet}`, "_blank");
            }}
          >
            {featuredWallet}
          </div>
        </>
      )}

      {hasOptionBtn && (
        <div
          style={{ position: "absolute", top: "5px", right: "5px" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Popover2
            content={
              <Menu>
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
      )}
    </Card>

  {/* This is the Modal that appears to ask if we should replace the Template / Image or not */}
  {modal.isOpen && (
    <CompModal
      modal={modal}
      setModal={setModal}
      ModalTitle={"Are you sure to replace the current page?"}
      ModalMessage={"This will remove all the content from your canvas"}
      onClickFunction={()=>{
        fnAddImageOnCanvas();
        setModal({
          ...modal,
          isOpen: false,
      })
      }} />
  )}

  </> );
};

export default CustomImageComponent;
// Custom Image card component end - 23Jun2023
