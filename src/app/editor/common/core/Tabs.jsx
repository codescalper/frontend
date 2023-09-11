import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "@blueprintjs/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  LoadMoreComponent,
  LoadingAnimatedComponent,
  MessageComponent,
  SearchComponent,
} from "..";
import { fnLoadMore } from "../../../../utils";

// `changeCanvasDimension` is True/False from the Passing Component
const Tabs = ({ defaultQuery, getAssetsFn, queryKey, changeCanvasDimension}) => {
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
  const { isDisconnected, address } = useAccount();

  // const [isLensjump, setIsLensjump ] = useState(false); 

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [queryKey, delayedQuery || defaultQuery],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getAssetsFn(delayedQuery || defaultQuery, pageParam),
  });

  // console.log("Data in Tabs.jsx")
  // console.log(data);
  // console.log(defaultQuery);

  // useEffect(() => {
  //   if( defaultQuery === "lensjump" ){
  //     setIsLensjump(true);
  //   }
  //   else setIsLensjump(false);
  // }, [defaultQuery]);

  // console.log("isLensjump in Tabs.jsx")
  // console.log(isLensjump);

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  useEffect(() => {
    if (isDisconnected || !address) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  // Show Loading - 06Jul2023
  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }
  return isError ? (
    <ErrorComponent message={error} />
  ) : (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder={`Search ${changeCanvasDimension ? "Backgrounds" : "Stickers"}`}
      />
 
      {/* {isLensjump && (
        // data?.data?.assets?.length > 0 && 
        // data?.pages[0]?.data.assets.length > 0 && 
        <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-2 overflow-y-auto">
       
        { data?.pages 
        .flatMap((item) => item?.data?.assets)
        // data?.pages[0]?.data?.assets
        .map((item, index) => {
          console.log("item in Tabs.jsx")
          console.log(item);
          return (
            <CustomImageComponent
              key={index}
              preview={item?.image}
              dimensions={item?.dimensions != null && item.dimensions}
              changeCanvasDimension={changeCanvasDimension}
            />
          );
        })
      }
      </div>
      </div>
      )} */}

    {data?.pages[0]?.data.length > 0 ? ( 
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-2 overflow-y-auto">
            {data?.pages
              .flatMap((item) => item?.data)
              .map((item, index) => {
                return (
                  <CustomImageComponent
                    key={index}
                    preview={item?.image}
                    dimensions={item?.dimensions != null && item.dimensions}
                    changeCanvasDimension={changeCanvasDimension}
                  />
                ); 
              })}
          </div>
          <LoadMoreComponent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
        
      ) : (
        <MessageComponent message="No results found" />
      )}
      
    </>
  );
};

export default Tabs;
