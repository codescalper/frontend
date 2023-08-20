// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Card } from "@blueprintjs/core";
import { replaceImageURL } from "../services/replaceUrl";
import { useEffect, useState } from "react";

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({
  design,
  preview,
  json,
  store,
  dimensions,
  isBackground,
  lensUserName
}) => {
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
  const fnDropImageOnCanvas = () => {
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
      className="relative p-0 m-1 rounded-lg"
      interactive
      onDragEnd={() => {
        fnDropImageOnCanvas();
      }}
      onClick={() => {
        fnDropImageOnCanvas();
      }}
    >
      <div className="rounded-lg">
        {/* If the `lensUseName` is present only then show this: */}
        {lensUserName &&
          <div className="bg-[#9aff1534] flex flex-row align-middle justify-normal rounded-t-lg" >
            <div className="p-0.5 pb-1"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://lens.xyz/`, "_blank")
              }}>
              <img src="/lensLogo.jpg" alt="" className="h-5 rounded-l-md rounded-sm" /></div>

              <div className="p-1 pl-1 text-xs hover:text-slate-500"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`https://lenster.xyz/u/${lensUserName}`, "_blank")
                }
                }
              >
                {
                  // Check if the lensUserName length is more than a specific number, to avoid overflow
                  `${lensUserName.length > 16 ?
                    `@${lensUserName.substring(0, 16)} ...` :
                    `@${lensUserName.substring(0, 16)}`
                  }`
                }
            </div>
            <hr className="mt-1" />
          </div>
        }
        <LazyLoadImage
          placeholderSrc={base64Data}
          effect="blur"
          src={base64Data}
          alt="Preview Image"
        />
      </div>
    </Card>
  );
};

export default CustomImageComponent;
// Custom Image card component end - 23Jun2023
