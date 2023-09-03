// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button, Card, Menu, MenuItem, Position } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { replaceImageURL } from "../../../../utils/replaceUrl";
import { useEffect, useState } from "react";
import { useStore } from "../../../../hooks";
import { fnPageHasElements } from "../../../../utils/fnPageHasElements"
import CompModal from "../modals/ModalComponent";

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({
  design,
  preview,
  json,
  dimensions,
  changeCanvasDimension,
  hasOptionBtn
}) => {
  const store = useStore();
  const [base64Data, setBase64Data] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // function for random 3 digit number
  const randomThreeDigitNumber = () => {
    return Math.floor(100 + Math.random() * 900);
  };

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

    changeCanvasDimension && store.setSize(dimensions[0], dimensions[1]);

    // Add Image on the Canvas
    store.activePage?.addElement({
      type: "image",
      // src: replaceImageURL(preview) + `?token=${randomThreeDigitNumber()}`, //Image URL
      src: base64Data, //Image URL
      width: changeCanvasDimension ? store.width : 300,
      height: changeCanvasDimension ? store.height : 300,
      x: changeCanvasDimension ? 0 : store.width / 4,
      y: changeCanvasDimension ? 0 : store.height / 4,
    });

    // if any json data is present, load it on the canvas
    {json && 
      // if()
      store?.loadJSON(json);
    }
  }

  // Function for drop/add image on canvas
  const handleClickOrDrop = () => {
    if(fnPageHasElements){
      console.log("Page has elements");
      fnAddImageOnCanvas();
      // setOpenModal(true);
    }
    else{
      console.log("Page has no elements");
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
      className="relative p-0 m-1 rounded-lg cursor-pointer"
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

  {/* {
    openModal &&  
    <CompModal 
      icon={"info"}
      onClickFunction={fnAddImageOnCanvas} 
      ModalTitle={"There are elements on this canvas"} 
      ModalMessage={"All the Elements on this page will be lost"}     
    />
  
  } */}
    </> );
};

export default CustomImageComponent;
// Custom Image card component end - 23Jun2023
