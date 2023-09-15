// --------
// This is a component that wraps as a carousel for the `image array` passed
// Params: `arrData` is the object array that contain all the json, preview, dimensions, etc
// --------

import { Carousel } from "@material-tailwind/react";
import { CustomImageComponent } from "../../../../common";
import { getFeaturedAssets } from "../../../../../../services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const CompCarousel = ({ type }) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [type === "background" && "background", "lensjump"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getFeaturedAssets(type === "background" && "background", pageParam),
  });

  return (
    // autoplay loop autoplayDelay={5000} - For AutoPlay
    <Carousel
      className="rounded-xl h-40 overflow-x-hidden"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all text-black content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {/* `arrData` - Data Object array and it's destructuring `arrData.data`, `arrData.preview` */}
      {data?.pages[0]?.data.length > 0 &&
        data?.pages
          .flatMap((item) => item?.data)
          .map((item, index) => {
            return (
              <CustomImageComponent
                isLensCollect={item?.wallet}
                // json = {mapData?.data} //Pass Json if it's a template
                preview={item?.image}
                dimensions={item?.dimensions != null && item.dimensions}
                recipientWallet={item?.wallet}
                changeCanvasDimension={true}
                className="h-full w-full object-cover overflow-hidden"
              />
            );
          })}
    </Carousel>
  );
};

export default CompCarousel;
