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
} from "../../elements";
import { useQuery } from "@tanstack/react-query";

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

export const CompIcons = observer(({ store, query }) => {
  // load data
  const count = 50;
  const { data, isLoading, loadMore, setQuery, error } = useInfiniteAPI({
    getAPI: ({ page, query }) =>
      `${API}/get-iconfinder?query=${query}&offset=${
        (page - 1) * count
      }&count=${count}&KEY=${getKey()}`,
    getSize: (res) => {
      return Math.ceil(res.total_count / count);
    },
  });

  React.useEffect(() => {
    setQuery(query);
  }, [query]);

  return (
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
  );
});

// New Tab NFT Elements/Stickers Start - 24Jun2023
// export const CompSupducks = observer(({ store, query }) => {
export const CompSupducks = observer(({ store, query }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assets", "supducks"],
    queryFn: () => getAssetByQuery("supducks"),
  });
  const { address, isDisconnected } = useAccount();
  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState("");

  // const getAssets = async (query) => {
  //   setIsLoading(true);
  //   const res = await getAssetByQuery(query);
  //   if (res?.data) {
  //     setData(res?.data);
  //     setIsLoading(false);
  //   } else if (res?.error) {
  //     setIsLoading(false);
  //     setIsError(res?.error);
  //     console.log(res.error);
  //   }
  // };

  // useEffect(() => {
  //   getAssets("supducks");
  // }, [query]);

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
      <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-2 overflow-y-auto">
          {data.map((item, index) => {
            return (
              <CustomImageComponent
                key={index}
                preview={item.image}
                store={store}
                project={project}
              />
            );
          })}
          <div className="my-2">
            <button onClick={() => setOffset(offset + 100)}>Load More</button>
          </div>
        </div>
      </div>
    </>
  );
});

// New Tab NFT Elements/Stickers End - 24Jun2023

// ----------- New Tabs - Nouns, Lens, Assorted START - 11Jul2023 -----------

// New Tab Lens Start - 11Jul2023
export const CompLens = observer(({ store, query }) => {
  const { address, isDisconnected } = useAccount();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [query, setQuery] = useState("supducks");
  const [isError, setIsError] = useState("");
  const [offset, setOffset] = useState(0);

  const getAssets = async (query) => {
    setIsLoading(true);
    const res = await getAssetByQuery(query, offset);
    if (res?.data) {
      setData(res?.data);
      setIsLoading(false);
    } else if (res?.error) {
      setIsLoading(false);
      setIsError(res?.error);
      console.log(res.error);
    }
  };

  useEffect(() => {
    getAssets("supducks");
  }, [query, offset]);

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
    <ErrorComponent message={isError} />
  ) : (
    <>
      <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-2 overflow-y-auto">
          {data.map((img) => {
            return (
              <CustomImageComponent
                preview={img.image}
                store={store}
                project={project}
              />
            );
          })}
          <div className="my-2">
            <button onClick={() => setOffset(offset + 100)}>Load More</button>
          </div>
        </div>
      </div>
    </>
  );
});

// New Tab Lens End - 11Jul2023

// New Tab Nouns Start - 11Jul2023
export const CompNouns = observer(({ store, query }) => {
  const { address, isDisconnected } = useAccount();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [query, setQuery] = useState("supducks");
  const [isError, setIsError] = useState("");
  const [offset, setOffset] = useState(0);

  const getAssets = async (query) => {
    setIsLoading(true);
    const res = await getAssetByQuery(query, offset);
    if (res?.data) {
      setData(res?.data);
      setIsLoading(false);
    } else if (res?.error) {
      setIsLoading(false);
      setIsError(res?.error);
      console.log(res.error);
    }
  };

  useEffect(() => {
    getAssets("supducks");
  }, [query, offset]);

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
    <ErrorComponent message={isError} />
  ) : (
    <>
      <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-2 overflow-y-auto">
          {data.map((img) => {
            return (
              <CustomImageComponent
                preview={img.image}
                store={store}
                project={project}
              />
            );
          })}
          <div className="my-2">
            <button onClick={() => setOffset(offset + 100)}>Load More</button>
          </div>
        </div>
      </div>
    </>
  );
});

// New Tab Nouns End - 11Jul2023

// New Tab Assorted Start - 11Jul2023
export const CompAssorted = observer(({ store, query }) => {
  const { address, isDisconnected } = useAccount();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [query, setQuery] = useState("supducks");
  const [isError, setIsError] = useState("");
  const [offset, setOffset] = useState(0);

  const getAssets = async (query) => {
    setIsLoading(true);
    const res = await getAssetByQuery(query, offset);
    if (res?.data) {
      setData(res?.data);
      setIsLoading(false);
    } else if (res?.error) {
      setIsLoading(false);
      setIsError(res?.error);
      console.log(res.error);
    }
  };

  useEffect(() => {
    getAssets("supducks");
  }, [query, offset]);

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
    <ErrorComponent message={isError} />
  ) : (
    <>
      <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-2 overflow-y-auto">
          {data.map((img) => {
            return (
              <CustomImageComponent
                preview={img.image}
                store={store}
                project={project}
              />
            );
          })}
          <div className="my-2">
            <button onClick={() => setOffset(offset + 100)}>Load More</button>
          </div>
        </div>
      </div>
    </>
  );
});

// New Tab Assorted End - 11Jul2023

// ----------- New Tabs - Nouns, Lens, Assorted END - 11Jul2023 -----------

export const IconsPanel = ({ store }) => {
  const requestTimeout = React.useRef();
  const [query, setQuery] = React.useState("");
  const [delayedQuery, setDelayedQuery] = React.useState(query);
  const [currentTab, setCurrentTab] = useState("tabIcons");

  React.useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

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
            setCurrentTab("tabAssorted");
          }}
          active={currentTab === "tabAssorted"}
          // icon=""
        >
          Assorted
        </Button>
      </div>
      {/* New Tabs Lens, Nouns, Assorted END - 11Jul2023 */}

      <div className="flex flex-row justify-normal">
        <input
          className="border px-2 py-1 rounded-md w-full m-1 mb-4 mt-4"
          placeholder="Search by Token ID"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <Button
          className="ml-3 m-1 rounded-md mb-4 mt-4"
          icon="search"
          onClick={
            () => console.log(query)
            // Implement Search Function here
          }
        ></Button>
      </div>

      {currentTab === "tabIcons" && (
        <CompIcons query={delayedQuery} store={store} />
      )}
      {currentTab === "tabSupducks" && (
        <CompSupducks query={delayedQuery} store={store} />
      )}
      {currentTab === "tabLens" && (
        <CompLens query={delayedQuery} store={store} />
      )}
      {currentTab === "tabNouns" && (
        <CompNouns query={delayedQuery} store={store} />
      )}
      {currentTab === "tabAssorted" && (
        <CompAssorted query={delayedQuery} store={store} />
      )}
    </div>
  );
};

// define the new custom section
export const IconsSection = {
  name: "Elements",
  Tab: (props) => (
    <SectionTab name="Stickers" {...props}>
      <Icon icon="new-drawing" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: IconsPanel,
};
