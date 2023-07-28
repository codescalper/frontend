import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { InputGroup, Button, Card, Spinner, Icon } from "@blueprintjs/core";
import { isAlive } from "mobx-state-tree";
import { svgToURL } from "polotno/utils/svg";
import { SectionTab } from "polotno/side-panel";
import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import styled from "polotno/utils/styled";
import { t } from "polotno/utils/l10n";
import { useInfiniteAPI } from "polotno/utils/use-api";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { ElementsIcon, LayersIcon } from "../editor-icon";
import { getAssetByQuery } from "../../services/backendApi";
import { LazyLoadImage } from "react-lazy-load-image-component";
// Custom Image card component end - 01Jul2023
import { useAccount } from "wagmi";
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

const API = "https://api.polotno.dev/api";
// const API = 'http://localhost:3001/api';

const iconToSrc = async (id) => {
  const req = await fetch(
    `${API}/download-nounproject?id=${id}&KEY=${getKey()}`
  );
  const text = await req.text();
  const base64 = await svgToURL(text);
  return base64;
};

const limit = 50;

const NounContainer = styled("div")`
  height: 100%;
  overflow: hidden;

  & img {
    filter: invert(1);
  }
`;

export const CompIcons = observer(({ store }) => {
  const requestTimeout = React.useRef();
  const [query, setQuery] = React.useState("");
  const [delayedQuery, setDelayedQuery] = React.useState(query);

  // load data
  const count = 50;
  const {
    data,
    isLoading,
    loadMore,
    setQuery: setApiQuery,
    error,
  } = useInfiniteAPI({
    getAPI: ({ page, query }) =>
      `${API}/get-iconfinder?query=${query}&offset=${
        (page - 1) * count
      }&count=${count}&KEY=${getKey()}`,
    getSize: (res) => {
      return Math.ceil(res.total_count / count);
    },
  });

  React.useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  React.useEffect(() => {
    setApiQuery(delayedQuery);
  }, [delayedQuery]);

  return (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search icons"
      />
      <ImagesGrid
        shadowEnabled={false}
        images={data?.map((data) => data.icons).flat()}
        getPreview={(item) => item.raster_sizes[6].formats[0].preview_url}
        isLoading={isLoading}
        onSelect={async (item, pos, element) => {
          const { download_url } = item.vector_sizes[0].formats[0];
          if (element && element.type === "image" && !element.locked) {
            const req = await fetch(
              `${API}/download-iconfinder?download_url=${download_url}&KEY=${getKey()}`
            );
            const json = await req.json();
            const base64 = await svgToURL(json.content);
            element.set({ clipSrc: base64 });
            return;
          }
          // const { width, height } = await getImageSize(item.images['256']);
          const width = item.vector_sizes[0].size_width;
          const height = item.vector_sizes[0].size_height;
          store.history.transaction(async () => {
            const x = (pos?.x || store.width / 2) - width / 2;
            const y = (pos?.y || store.height / 2) - height / 2;
            const svg = store.activePage?.addElement({
              type: "svg",
              width,
              height,
              x,
              y,
            });
            const req = await fetch(
              `${API}/download-iconfinder?download_url=${download_url}&KEY=${getKey()}`
            );
            const json = await req.json();
            const base64 = await svgToURL(json.content);
            if (isAlive(svg)) {
              await svg.set({ src: base64 });
            }
          });
        }}
        rowsNumber={4}
        error={error}
        loadMore={loadMore}
      />
    </>
  );
});

// New Tab NFT Elements/Stickers Start - 24Jun2023
// export const CompSupducks = observer(({ store, query }) => {
export const CompSupducks = observer(({ store }) => {
  const [query, setQuery] = useState("");
  const requestTimeout = useRef();
  const [delayedQuery, setDelayedQuery] = useState(query);
  const { address, isDisconnected } = useAccount();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["assets", delayedQuery || "supducks"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getAssetByQuery(delayedQuery || "supducks", pageParam),
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
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  // console.log(data);

  return isError ? (
    <ErrorComponent message={error} />
  ) : (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Saerch stickers"
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

// New Tab NFT Elements/Stickers End - 24Jun2023

// ----------- New Tabs - Nouns, Lens, Assorted START - 11Jul2023 -----------

// New Tab Lens Start - 11Jul2023
export const CompLens = observer(({ store }) => {
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const requestTimeout = useRef();
  const [delayedQuery, setDelayedQuery] = useState(query);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["assets", delayedQuery || "lens"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getAssetByQuery(delayedQuery || "lens", pageParam),
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
        placeholder="Saerch stickers"
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

// New Tab Lens End - 11Jul2023

// New Tab Nouns Start - 11Jul2023
export const CompNouns = observer(({ store }) => {
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const requestTimeout = useRef();
  const [delayedQuery, setDelayedQuery] = useState(query);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["assets", delayedQuery || "nouns"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getAssetByQuery(delayedQuery || "nouns", pageParam),
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
        placeholder="Saerch stickers"
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

// New Tab Nouns End - 11Jul2023

// New Tab Assorted Start - 11Jul2023
export const CompAssorted = observer(({ store }) => {
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const requestTimeout = useRef();
  const [delayedQuery, setDelayedQuery] = useState(query);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["assets", delayedQuery || "assorted"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getAssetByQuery(delayedQuery || "assorted", pageParam),
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
        placeholder="Saerch stickers"
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

// New Tab Assorted End - 11Jul2023

// new tab for Fam Leady Society start
export const CompFLS = observer(({ store }) => {
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const requestTimeout = useRef();
  const [delayedQuery, setDelayedQuery] = useState(query);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["assets", delayedQuery || "fls"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getAssetByQuery(delayedQuery || "fls", pageParam),
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
        placeholder="Saerch stickers"
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
// New Tab Fam Leady Society ens

// ----------- New Tabs - Nouns, Lens, Assorted END - 11Jul2023 -----------

export const IconsPanel = ({ store }) => {
  const [currentTab, setCurrentTab] = useState("tabIcons");

  return (
    <div className="flex flex-col h-full">
      <div className="">
        <Button
          className="m-2 rounded-md"
          onClick={() => {
            setCurrentTab("tabIcons");
          }}
          active={currentTab === "tabIcons"}
          // icon="social-media"
        >
          Icons
        </Button>
        <Button
          className="m-2 rounded-md"
          onClick={() => {
            setCurrentTab("tabSupducks");
          }}
          active={currentTab === "tabSupducks"}
          // icon=""
        >
          Supducks
        </Button>

        {/* New Tabs Lens, Nouns, Assorted START - 11Jul2023 */}
        <Button
          className="m-2 rounded-md"
          onClick={() => {
            setCurrentTab("tabLens");
          }}
          active={currentTab === "tabLens"}
          // icon=""
        >
          Lens
        </Button>
        <Button
          className="m-2 rounded-md"
          onClick={() => {
            setCurrentTab("tabNouns");
          }}
          active={currentTab === "tabNouns"}
          // icon=""
        >
          Nouns
        </Button>
        <Button
          className="m-2 rounded-md"
          onClick={() => {
            setCurrentTab("tabFLS");
          }}
          active={currentTab === "tabFLS"}
          // icon=""
        >
          FLS
        </Button>
        <Button
          className="m-2 rounded-md"
          onClick={() => {
            setCurrentTab("tabAssorted");
          }}
          active={currentTab === "tabAssorted"}
          // icon=""
        >
          Assorted
        </Button>
      </div>
      {/* New Tabs Lens, Nouns, Assorted END - 11Jul2023 */}

      {currentTab === "tabIcons" && <CompIcons store={store} />}
      {currentTab === "tabSupducks" && <CompSupducks store={store} />}
      {currentTab === "tabLens" && <CompLens store={store} />}
      {currentTab === "tabNouns" && <CompNouns store={store} />}
      {currentTab === "tabFLS" && <CompFLS store={store} />}
      {currentTab === "tabAssorted" && <CompAssorted store={store} />}
    </div>
  );
};

// define the new custom section
export const IconsSection = {
  name: "Elements",
  Tab: (props) => (
    <SectionTab name="Stickers" {...props}>
      <Icon icon="emoji" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: IconsPanel,
};
