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
import { useContext } from "react";
import { Context } from "../../../../context/ContextProvider";

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({
  preview,
  dimensions,
  isBackground,
  hasOptionBtn,
  onDelete,
  isLensCollect,
}) => {
  const store = useStore();
  const [base64Data, setBase64Data] = useState("");
  const { referredFromRef } = useContext(Context);

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

  // function for drop/add image on canvas
  const handleClickOrDrop = () => {
    // set the canvas size if it's a background image
    isBackground && store.setSize(dimensions[0], dimensions[1]);

    // if nft is a lens collect, add it to the referredFromRef but check if a handle is already
    if (isLensCollect?.isLensCollect) {
      if (!referredFromRef.current.includes(isLensCollect?.lensHandle)) {
        referredFromRef.current.push(isLensCollect?.lensHandle);
      }
    }

    store.activePage?.addElement({
      type: "image",
      src: base64Data, //Image URL
      width: isBackground ? store.width : 300,
      height: isBackground ? store.height : 300,
      x: isBackground ? 0 : store.width / 4,
      y: isBackground ? 0 : store.height / 4,
    });
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

  return (
    <Card
      className="relative p-0 m-1 rounded-lg"
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
            className="bg-[#E1F26C] p-1 rounded-lg absolute top-2 left-2 opacity-60 hover:opacity-100"
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
  );
};

export default CustomImageComponent;
// Custom Image card component end - 23Jun2023
