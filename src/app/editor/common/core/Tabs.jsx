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

const Tabs = ({ defaultQuery, getAssetsFn, queryKey, isBackground }) => {
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
  const { isDisconnected, address } = useAccount();

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
        placeholder={`Search ${isBackground ? "Backgrounds" : "Stickers"}}`}
      />
      {data?.pages[0]?.data.length > 0 ? (
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-2 overflow-y-auto">
            {data?.pages
              .flatMap((item) => item?.data)
              .map((item, index) => {
                return (
                  <CustomImageComponent
                    key={index}
                    preview={item.image}
                    dimensions={item?.dimensions != null && item.dimensions}
                    isBackground={isBackground}
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
