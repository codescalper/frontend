import { ImagesGrid, SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../editor-icon";
import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef } from "react";
import { Button, Spinner } from "@blueprintjs/core";

import {
  getAllCollection,
  getNFTs,
  getNftById,
  getNftByCollection,
  getCollectionNftById,
  refreshNFT,
  getRemovedBgS3Link,
} from "../../services/backendApi";
import { useAccount } from "wagmi";
import { convertIPFSUrl, getImageUrl } from "../../services/imageUrl";
import { toast } from "react-toastify";
import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  LoadMoreComponent,
  MessageComponent,
  SearchComponent,
} from "../../elements";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fnLoadMore } from "../../services/fnLoadMore";
import { fnMessage } from "../../services/fnMessage";

const NFTPanel = observer(({ store }) => {
  const [tab, setTab] = useState("lenspost");
  const { isConnected } = useAccount();
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg">NFT</h1>
      <div className="flex items-center justify-center space-x-2 my-4">
        <button
          className={`w-1/2 border px-2 py-1 border-black rounded-md ${
            tab === "lenspost" && "bg-[#1B1A1D]"
          } ${tab === "lenspost" && "text-white"}`}
          onClick={() => setTab("lenspost")}
        >
          Lenspost NFT Library
        </button>
        <button
          className={`w-1/2 border border-black px-2 py-1 rounded-md ${
            tab === "wallet" && "bg-[#1B1A1D]"
          } ${tab === "wallet" && "text-white"}`}
          onClick={() => setTab("wallet")}
        >
          My Wallet NFTs
        </button>
      </div>
      {tab === "lenspost" && <LenspostNFT />}
      {tab === "wallet" && <WalletNFT />}
    </div>
  );
});

// define the new custom section
export const NFTSection = {
  name: "NFT",
  Tab: (props) => (
    <SectionTab name="NFT" {...props}>
      <NFTIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: NFTPanel,
};

// catogoery component (child component of LenspostNFT component)
const RenderCategories = ({ contractAddressRef, setActiveCat, searchId }) => {
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["lenspost-nft-collections"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getAllCollection(pageParam),
  });

  // run fetchNextPage() function when scroll to bottom
  useEffect(() => {
    if (isDisconnected || !address) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search collections"
      />
      {isError ? (
        <ErrorComponent error={error} />
      ) : data?.pages[0]?.data.length > 0 ? (
        <>
          {data?.pages
            .flatMap((item) => item?.data)
            .map((item, index) => (
              <div className="" key={index}>
                <div
                  className="flex items-center space-x-4 p-2 mb-4 cursor-pointer"
                  onClick={() => {
                    contractAddressRef.current = item.address;
                    setActiveCat(item.name);
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-md"
                  />
                  <p className="text-lg font-normal">{item.name}</p>
                </div>
              </div>
            ))}
          <LoadMoreComponent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      ) : (
        <MessageComponent message="No Results" />
      )}
    </>
  );
};

// nft component (child component of LenspostNFT component)
const RenderImages = ({ contractAddressRef, setActiveCat, activeCat }) => {
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
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
    queryKey: ["lenspost-nft-collections", contractAddressRef.current],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getNftByCollection(contractAddressRef.current, pageParam),
  });

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  function goBack() {
    setActiveCat(null);
  }

  // run fetchNextPage() function when scroll to bottom
  useEffect(() => {
    if (isDisconnected || !address) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return delayedQuery ? (
    <RenderSearchedNFTs
      activeCat={activeCat}
      contractAddress={contractAddressRef.current}
      goBack={goBack}
      delayedQuery={delayedQuery}
    />
  ) : (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search NFTs by id"
      />
      <div className="h-88">
        <div className="flex flex-row align-middle w-full bg-[#fff] sticky top-0 z-10">
          <Button
            className="mb-4 ml-1"
            icon="arrow-left"
            onClick={() => {
              goBack();
            }}
          ></Button>
          <h1 className="ml-4 align-middle text-lg font-bold">{activeCat}</h1>
        </div>
        {isError ? (
          <ErrorComponent error={error} />
        ) : data?.pages[0]?.data.length > 0 ? (
          //  {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 overflow-y-auto">
              {data?.pages
                .flatMap((item) => item?.data)
                .map((item, index) => {
                  return (
                    <CustomImageComponent
                      key={index}
                      preview={item?.imageURL}
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
          <MessageComponent message="No Results" />
        )}
      </div>
    </>
  );
};

// searched NFTs (child component of LenspostNFT component)
const RenderSearchedNFTs = ({
  contractAddress,
  activeCat,
  goBack,
  delayedQuery,
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "lenspost-nft-collections",
      contractAddress,
      { tokenID: delayedQuery },
    ],
    queryFn: () => getCollectionNftById(delayedQuery, contractAddress),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* <SearchComponent query={query} setQuery={setQuery} /> */}
      <div className="h-88">
        <div className="flex flex-row align-middle w-full bg-[#fff] sticky top-0 z-10">
          <Button
            className="mb-4 ml-1"
            icon="arrow-left"
            onClick={() => {
              goBack();
            }}
          ></Button>
          <h1 className="ml-4 align-middle text-lg font-bold">{activeCat}</h1>
        </div>
        {isError ? (
          <ErrorComponent error={error} />
        ) : data ? (
          //  {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 overflow-y-auto">
              <CustomImageComponent
                preview={data?.imageURL}
                store={store}
                project={project}
              />
            </div>
          </div>
        ) : (
          <MessageComponent message="No Results" />
        )}
      </div>
    </>
  );
};

const LenspostNFT = () => {
  const [activeCat, setActiveCat] = useState("");
  const { address, isDisconnected, isConnected } = useAccount();
  const contractAddressRef = useRef(null);

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden">
        {!activeCat ? (
          <RenderCategories
            contractAddressRef={contractAddressRef}
            setActiveCat={setActiveCat}
          />
        ) : (
          <RenderImages
            activeCat={activeCat}
            contractAddressRef={contractAddressRef}
            setActiveCat={setActiveCat}
          />
        )}
      </div>
    </>
  );
};

// searched nft component (child component of WalletNFT component)
const RenderSearchedWalletNFT = ({ goBack, delayedQuery }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userNFTs", { tokenID: delayedQuery }],
    queryFn: () => getNftById(delayedQuery),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* <SearchComponent query={query} setQuery={setQuery} /> */}
      <div className="h-88">
        <div className="flex flex-row align-middle w-full bg-[#fff] sticky top-0 z-10">
          <Button
            className="mb-4 ml-1"
            icon="arrow-left"
            onClick={() => {
              goBack();
            }}
          ></Button>
        </div>
        {isError ? (
          <ErrorComponent error={error} />
        ) : data ? (
          //  {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 overflow-y-auto">
              <CustomImageComponent
                preview={data?.imageURL}
                store={store}
                project={project}
              />
            </div>
          </div>
        ) : (
          <MessageComponent message="No Results" />
        )}
      </div>
    </>
  );
};

const WalletNFT = () => {
  const { isConnected, isDisconnected, address } = useAccount();

  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userNFTs"],
    queryFn: getNFTs,
  });

  const { mutateAsync } = useMutation({
    mutationKey: "refreshNFT",
    mutationFn: refreshNFT,
    onSuccess: () => {
      queryClient.invalidateQueries(["userNFTs"], { exact: true });
    },
  });

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  const refreshNFTs = () => {
    const id = toast.loading("Updating NFTs...");
    mutateAsync()
      .then((res) => {
        toast.update(id, {
          render: res?.data,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      })
      .catch((err) => {
        toast.update(id, {
          render: fnMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      });
  };

  const goBack = () => {
    setDelayedQuery("");
    setQuery("");
  };

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return delayedQuery ? (
    <RenderSearchedWalletNFT delayedQuery={delayedQuery} goBack={goBack} />
  ) : (
    <>
      <SearchComponent
        onClick={refreshNFTs}
        query={query}
        setQuery={setQuery}
        placeholder="Search NFTs by id"
      />

      {isError ? (
        <ErrorComponent message={error} />
      ) : data?.length ? (
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-2 overflow-y-auto">
            {data.map((imgArray, index) => {
              return (
                <CustomImageComponent
                  key={index}
                  preview={imgArray?.imageURL}
                  store={store}
                  project={project}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <MessageComponent message="No Results" />
      )}
    </>
  );
};
