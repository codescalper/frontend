// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Card } from "@blueprintjs/core";
import { replaceImageURL } from "../services/replaceUrl";

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({ design, preview, json, store, dimensions, isBackground }) => {
  // function for random 3 digit number
  const randomThreeDigitNumber = () => {
    return Math.floor(100 + Math.random() * 900);
  };

  const fnDropImageOnCanvas = () => {
    
    (isBackground && store.setSize(dimensions[0], dimensions[1]))

    store.activePage?.addElement({
      type: "image",
      src: replaceImageURL(preview) + `?token=${randomThreeDigitNumber()}`, //Image URL
      width: isBackground? store.width : store.width/2,
      height: isBackground? store.height : store.height/2,
      x : isBackground ? 0 : store.width/4,
      y : isBackground ? 0 : store.height/4

    });
  };

  return (
    <Card
      // style={{ margin: "4px", padding: "0px", position: "relative" }}
      className="relative p-0 m-1"
      interactive
      onDragEnd={() => {
        fnDropImageOnCanvas();
      }}
      onClick={() => {
        fnDropImageOnCanvas();
      }}
    >
      <div className="">
        <LazyLoadImage
          placeholderSrc={replaceImageURL(preview)}
          effect="blur"
          src={replaceImageURL(preview)}
          alt="Preview Image"
        />
      </div>
    </Card>
  );
};

export default CustomImageComponent;
// Custom Image card component end - 23Jun2023
