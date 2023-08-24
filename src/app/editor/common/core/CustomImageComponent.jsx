// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button, Card, Menu, MenuItem, Position } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { replaceImageURL } from "../../../../utils/replaceUrl";
import { useEffect, useState } from "react";
import { useStore } from "../../../../hooks";

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({
  design,
  preview,
  json,
  dimensions,
  isBackground,
  hasOptionBtn,
  onDelete,
}) => {
  const store = useStore();
  const [base64Data, setBase64Data] = useState("");

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
    isBackground && store.setSize(dimensions[0], dimensions[1]);

    store.activePage?.addElement({
      type: "image",
      // src: replaceImageURL(preview) + `?token=${randomThreeDigitNumber()}`, //Image URL
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
      className="relative p-0 m-1 rounded-lg cursor-pointer"
      // interactive
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
  );
};

export default CustomImageComponent;
// Custom Image card component end - 23Jun2023
