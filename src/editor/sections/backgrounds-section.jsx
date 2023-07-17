// Imports:
import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Icon, Spinner } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { BackgroundIcon } from "../editor-icon";
import { useAccount } from "wagmi";
import { getBGAssetByQuery } from "../../services/backendApi";
import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  LoadMoreComponent,
  MessageComponent,
  SearchComponent,
} from "../../elements";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fnLoadMore } from "../../services/fnLoadMore";

// New Tab Colors Start - 24Jun2023
export const TabColors = observer(({ store, query }) => {
  return (
    <>
      In Colors
      {/* Code for Colors here */}
    </>
  );
});

// New Tab Colors End - 24Jun2023

// New Tab NFT Backgrounds Start - 24Jun2023
export const TabNFTBgs = observer(({ store }) => {
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
  const { isDisconnected, address, isConnected } = useAccount();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["bg-assets", delayedQuery || "supducks"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getBGAssetByQuery(delayedQuery || "supducks", pageParam),
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

  if (isError) {
    return <ErrorComponent message={error} />;
  }

  // Show Loading - 06Jul2023
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }
  return isError ? (
    <ErrorComponent message={error} />
  ) : (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search backgrounds"
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
                    store={store}
                    project={project}
                    dimensions={item?.dimensions != null && item.dimensions}
                    isBackground={true}
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
});

// New Tab NFT Backgrounds End - 24Jun2023

export const BackgroundPanel2 = observer(({ store, query }) => {
  const [stTab, setStTab] = useState("tabNFTBgs");

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row h-fit">
        {/* <Button
			className="m-1 rounded-md border-2 p-2"
			onClick={() => {
				setStTab("tabColors");
			}}
			active={stTab === "tabColors"}
			icon="color-fill">
				Colors
		</Button> */}
        <Button
          className="m-2 rounded-md border-2 px-2"
          onClick={() => {
            setStTab("tabNFTBgs");
          }}
          active={stTab === "tabNFTBgs"}
          icon="build"
        >
          Supducks Backgrounds
        </Button>
      </div>

      {/* The Tab Elements start to appear here - 24Jun2023 */}
      {stTab === "tabColors" && <TabColors store={store} />}
      {stTab === "tabNFTBgs" && <TabNFTBgs store={store} />}
    </div>
  );
});

// define the new custom section
export const BackgroundSection2 = {
  name: "Backgrounds2",
  Tab: (props) => (
    <SectionTab name="NFT Banners" {...props}>
      <BackgroundIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: BackgroundPanel2,
};
