// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Card } from "@blueprintjs/core";
import { replaceImageURL } from "../services/replaceUrl";

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
  // function for random 3 digit number
  const randomThreeDigitNumber = () => {
    return Math.floor(100 + Math.random() * 900);
  };

  const fnDropImageOnCanvas = () => {
    isBackground && store.setSize(dimensions[0], dimensions[1]);

    store.activePage?.addElement({
      type: "image",
      src: replaceImageURL(preview) + `?token=${randomThreeDigitNumber()}`, //Image URL
      width: isBackground ? store.width : 300,
      height: isBackground ? store.height : 300,
      x: isBackground ? 0 : store.width / 4,
      y: isBackground ? 0 : store.height / 4,
    });
  };

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
        {lensUserName && 
        // <div className="bg-[#9aff154b] flex flex-row align-middle justify-normal rounded-t-lg" >
        <div className="bg-[#8a5cf61c] flex flex-row align-middle justify-normal rounded-t-lg" >
            {/* <div className="p-0.5 pb-1"> <img src="/lensLogo.jpg" alt="" className="h-5 rounded-l-md rounded-sm" /></div> */}
            <div className="p-0.5 pb-1" 
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://lenster.xyz/`, "_blank")
              }}
            > 
              <img src="/svgs/lensterLogo.svg" alt="" className="h-4 pl-1 rounded-l-md rounded-sm" /></div>
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
              `@${lensUserName.substring(0,16)} ...` : 
                `@${lensUserName.substring(0,16)}`
              }`} 

            </div>
            <hr className="mt-1"/>  
        </div> 
        }
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
