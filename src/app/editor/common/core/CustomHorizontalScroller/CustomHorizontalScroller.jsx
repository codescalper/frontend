// --------
// This is a custom horizontal scroller component
// Params to pass: `arrImages` is an object array of images to be displayed in the scroller,
// The object specific destructuring is to be done Ex: `arrImages.img` for Image, `arrImages.json` for JSON
// `propWidth` - width of the Image
// --------

import React, { useEffect, useRef, useState } from "react";
import "./Styles/index.css";
import CustomImageComponent from "../CustomImageComponent";
import BsChevronLeft from "@meronex/icons/bs/BsChevronLeft";
import BsChevronRight from "@meronex/icons/bs/BsChevronRight";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeaturedAssets } from "../../../../../services";

const CustomHorizontalScroller = ({ type }) => {
  const [arrImages, setArrImages] = useState();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [type === "stickers" && "stickers", "lensjump"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getFeaturedAssets(pageParam, type === "stickers" && "props"),
  });

  const scrollWrapperRef = useRef(null);


  const distance = 300;

  const fnScrollLeft = () => {
    scrollWrapperRef.current.scrollBy({
      left: -distance,
      behavior: "smooth",
    });
  };
  const fnScrollRight = () => {
    scrollWrapperRef.current.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  };


  return (
    <>
      <div className="sectionWrapper">
        {/* Left and Right Buttons */}
        <div className="btnsWrapper" id="new">
          <div onClick={fnScrollLeft} id="button-left">
            {" "}
            <BsChevronLeft />{" "}
          </div>
          <div onClick={fnScrollRight} id="button-right">
            {" "}
            <BsChevronRight />{" "}
          </div>
        </div>

        {/* Images Inside the Horizontal scroller */}
        <div id="outsider" ref={scrollWrapperRef}>
          <div className="divsWrapper" id="insider">
            {data?.pages[0]?.data.length > 0 &&
              data?.pages
                .flatMap((item) => item?.data)
                .map((item, index) => {
                  return (
                    <div id={index} className="eachDiv">
                      {" "}
                      <CustomImageComponent
                        dimensions={item.dimensions}
                        preview={item.image}
                      />{" "}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomHorizontalScroller;
