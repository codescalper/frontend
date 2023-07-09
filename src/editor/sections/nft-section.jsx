import { ImagesGrid, SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../editor-icon";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { Button } from "@blueprintjs/core";
import {
  getAllCollection,
  getNFTs,
  getNftById,
  getNftByCollection,
  getCollectionNftById,
  refreshNFT,
} from "../../services/backendApi";
import { useAccount } from "wagmi";
import { convertIPFSUrl, getImageUrl } from "../../services/imageUrl";
import { toast } from "react-toastify";
import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
} from "../../elements";
import { useQuery } from "@tanstack/react-query";

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
      {tab === "wallet" && isConnected && <WalletNFT />}
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

const LenspostNFT = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lenspost-nft-collections"],
    queryFn: getAllCollection,
  });
  const [lenspostNFTImages, setLenspostNFTImages] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [collection, setCollection] = useState([]);
  const { address, isDisconnected, isConnected } = useAccount();
  const [isNftsError, setIsNftsError] = useState("");
  const [searchId, setSearchId] = useState("");

  // const searchNFT = async () => {
  //   if (!activeCat) return;
  //   setIsLoading(true);
  //   const res = await getCollectionNftById(searchId, contractAddress);
  //   let obj = {};
  //   let arr = [];

  //   if (res?.data) {
  //     if (res?.data?.ipfsLink?.includes("ipfs://")) {
  //       res.data.ipfsLink = convertIPFSUrl(res?.data?.ipfsLink);
  //       obj = { url: res?.data[i].ipfsLink };
  //       arr.push(obj);
  //     } else {
  //       obj = { url: res?.data?.ipfsLink };
  //       arr.push(obj);
  //     }
  //     setLenspostNFTImages(arr);
  //     setIsLoading(false);
  //     setSearchId("");
  //   } else if (res?.data === "") {
  //     setIsNftsError("NFT not found");
  //     setSearchId("");
  //   } else if (res?.error) {
  //     setIsNftsError(res?.error);
  //     setIsLoading(false);
  //     setSearchId("");
  //   }

  //   if (!searchId) {
  //     getNftByContractAddress();
  //   }
  // };

  // const getNftByContractAddress = async () => {
  //   if (!contractAddress) return;
  //   setIsLoading(true);
  //   const res = await getNftByCollection(contractAddress);
  //   if (res?.data) {
  //     const images = getImageUrl(res?.data);
  //     setLenspostNFTImages(images);
  //     setIsLoading(false);
  //   } else if (res?.error) {
  //     setIsNftsError(res?.error);
  //     setIsLoading(false);
  //   }
  // };

  // async function loadImages() {
  //   // here we should implement your own API requests
  //   setIsLoading(true);
  //   const res = await getAllCollection();
  //   if (res?.data) {
  //     setCollection(res?.data);
  //     setIsLoading(false);
  //   } else if (res?.error) {
  //     setIsError(res?.error);
  //     setIsLoading(false);
  //   }
  // }

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  function RenderCategories() {
    return isError ? (
      <ErrorComponent message={error} />
    ) : (
      <>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="text-center">
              <p className="text-gray-500 text-sm mt-4">
                Loading collections...
              </p>
            </div>
          </div>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <div className="" key={index}>
              <div
                className="flex items-center space-x-4 p-2 mb-4 cursor-pointer"
                onClick={() => {
                  setContractAddress(item.address);
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
          ))
        ) : (
          <p>No results</p>
        )}
      </>
    );
  }

  function RenderImages() {
    return (
      <div className="h-full">
        <div className="flex flex-row align-middle w-full bg-[#fff] sticky top-0 z-10 m-1 mb-4">
          <Button
            icon="arrow-left"
            onClick={() => {
              goBack();
              setIsNftsError("");
            }}
          ></Button>
          <h1 className="ml-4 align-middle text-lg font-bold">{activeCat}</h1>
        </div>
        {isNftsError ? (
          <div>{isNftsError}</div>
        ) : (
          <>
            {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-2 overflow-y-auto">
                {lenspostNFTImages.map((imgArray) => {
                  return (
                    <CustomImageComponent
                      preview={imgArray.url}
                      store={store}
                      project={project}
                    />
                  );
                })}
                <button onClick={loadMore}>Load More</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  function goBack() {
    setActiveCat(null);
  }

  return (
    <>
      <div className="flex flex-row justify-normal mb-4">
        <input
          className="border px-2 py-1 rounded-md w-full"
          placeholder="Search by Token ID"
          onChange={(e) => {
            setSearchId(e.target.value);
          }}
          value={searchId}
        />
        <Button
          icon="search"
          className="ml-4"
          onClick={() => searchNFT(searchId)}
        ></Button>
      </div>
      <div className="overflow-y-auto">
        {activeCat === null ? <RenderCategories /> : <RenderImages />}
      </div>
    </>
  );
};

const WalletNFT = () => {
  const { isConnected, isDisconnected, address } = useAccount();
  const [walletNFTImages, setWalletNFTImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [isError, setIsError] = useState("");
  const [stShowBackBtn, setStShowBackBtn] = useState(false);
  const [isNftsError, setIsNftsError] = useState("");

  const refreshNFTs = async () => {
    const id = toast.loading("Updating NFTs...");
    const res = await refreshNFT();
    if (res?.data) {
      toast.update(id, {
        render: res?.data,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      loadImages();
    } else if (res?.error) {
      toast.update(id, {
        render: res?.error,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  const searchNFT = async (searchId) => {
    if (walletNFTImages.length === 0) return;
    let obj = {};
    let arr = [];
    const res = await getNftById(searchId);
    if (res?.data) {
      res.data.permaLink = convertIPFSUrl(res?.data?.permaLink);
      obj = { url: res?.data?.permaLink };
      arr.push(obj);
      setWalletNFTImages(arr);
      setStShowBackBtn(true);
      setSearchId("");
    } else if (res?.data === "") {
      setIsNftsError("NFT not found");
      setSearchId("");
      setStShowBackBtn(true);
    } else if (res?.error) {
      setIsNftsError(res?.error);
      setSearchId("");
      setStShowBackBtn(true);
    }

    if (!searchId) {
      loadImages();
    }
  };

  async function loadImages() {
    setIsLoading(true);
    // here we should implement your own API requests
    const res = await getNFTs();
    if (res?.data) {
      const images = getImageUrl(res?.data);
      setWalletNFTImages(images);
      setIsLoading(false);
    } else if (res?.error) {
      setIsError(res?.error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isDisconnected) return;
    loadImages();
  }, [isConnected]);

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  return (
    <>
      <div className="flex flex-row justify-normal mb-4">
        <input
          className="border px-2 py-1 rounded-md w-full"
          placeholder="Search by Token ID"
          onChange={(e) => setSearchId(e.target.value)}
          value={searchId}
        />
        <Button
          className="ml-4"
          icon="search"
          onClick={() => searchNFT(searchId)}
        ></Button>
        {/* you can create yur own custom component here */}
        {/* but we will use built-in grid component */}
        {/* {walletNFTImages.length > 0 && ( */}

        <Button className="ml-4" icon="refresh" onClick={refreshNFTs}></Button>
      </div>

      {stShowBackBtn && (
        <Button
          className="mt-4 mb-4 w-1"
          icon="arrow-left"
          onClick={() => {
            loadImages();
            setSearchId("");
            setStShowBackBtn(false);
            setIsNftsError("");
          }}
        ></Button>
      )}

      {isError ? (
        <ErrorComponent message={isError} />
      ) : isNftsError ? (
        <ErrorComponent message={isNftsError} />
      ) : (
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-2 overflow-y-auto">
            {walletNFTImages.map((imgArray) => {
              return (
                <CustomImageComponent
                  preview={imgArray.url}
                  store={store}
                  project={project}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
