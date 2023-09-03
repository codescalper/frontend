// --------
// This is a component that wraps as a carousel for the `image array` passed
// Params: `arrData` is the object array that contain all the json, preview, dimensions, etc
// --------

import { Carousel } from "@material-tailwind/react";
import { CustomImageComponent } from "../../../../common";
 
export function CompCarousel({arrData}) {

  return (
    // autoplay loop autoplayDelay={5000} - For AutoPlay

    <Carousel className="rounded-xl h-40 overflow-hidden"
    navigation={({ setActiveIndex, activeIndex, length }) => (
      <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
        {new Array(length).fill("").map((_, i) => (
          <span
            key={i}
            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
              activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
            }`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
        </div>
        )}
        >
      
      {arrData && arrData.map(( mapData )=>{

        return(
          <CustomImageComponent  
            // json = {mapData.data} //Pass Json if it's a template 
            preview={mapData.preview || mapData.image}
            className="h-full w-full object-cover"
          /> 
          )
      } 
      )
      }
  
  </Carousel>
  );
}