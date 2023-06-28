import { SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../editor-icon";
import { observer } from "mobx-react-lite";
import { useState, useEffect, useContext } from "react";
import { getImageSize } from "polotno/utils/image";
import { InputGroup } from "@blueprintjs/core";
import { ImagesGrid } from "polotno/side-panel/images-grid";
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
import { Context } from "../../context/ContextProvider";

// New Imports:
import { Button } from "@blueprintjs/core";

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
  const [lenspostNFTImages, setLenspostNFTImages] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [collection, setCollection] = useState([]);
  const { address, isDisconnected, isConnected } = useAccount();
  const [isError, setIsError] = useState("");
  const [isNftsError, setIsNftsError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchNFT = async () => {
    if (!activeCat) return;
    setIsLoading(true);
    const res = await getCollectionNftById(searchId, contractAddress);
    let obj = {};
    let arr = [];

    if (res?.data) {
      if (res?.data?.ipfsLink?.includes("ipfs://")) {
        res.data.ipfsLink = convertIPFSUrl(res?.data?.ipfsLink);
        obj = { url: res?.data[i].ipfsLink };
        arr.push(obj);
      } else {
        obj = { url: res?.data?.ipfsLink };
        arr.push(obj);
      }
      setLenspostNFTImages(arr);
      setIsLoading(false);
      setSearchId("");
    } else if (res?.data === "") {
      setIsNftsError("NFT not found");
      setSearchId("");
    } else if (res?.error) {
      setIsNftsError(res?.error);
      setIsLoading(false);
      setSearchId("");
    }

    if (!searchId) {
      getNftByContractAddress();
    }
  };

  const getNftByContractAddress = async () => {
    if (!contractAddress) return;
    setIsLoading(true);
    const res = await getNftByCollection(contractAddress);
    if (res?.data) {
      const images = getImageUrl(res?.data);
      setLenspostNFTImages(images);
      setIsLoading(false);
    } else if (res?.error) {
      setIsNftsError(res?.error);
      setIsLoading(false);
    }
  };

  async function loadImages() {
    // here we should implement your own API requests
    setIsLoading(true);
    const res = await getAllCollection();
    if (res?.data) {
      setCollection(res?.data);
      setIsLoading(false);
    } else if (res?.error) {
      setIsError(res?.error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isDisconnected) return;

    getNftByContractAddress();
  }, [contractAddress]);

  useEffect(() => {
    if (isDisconnected) return;

    loadImages();
  }, [isConnected]);

  if (isDisconnected || !address) {
    return (
      <>
        <p>Please connect your wallet</p>
      </>
    );
  }

  function RenderCategories() {
    return isError ? (
      <p>{isError}</p>
    ) : (
      <>
        {collection.length > 0 ? (
          collection.map((item, index) => (
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
      <div className="">
        <div className="flex flex-row align-middle">
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
          <ImagesGrid
            images={lenspostNFTImages}
            getPreview={(image) => image.url}
            onSelect={async (image, pos) => {
              const { width, height } = await getImageSize(image.url);
              store.activePage.addElement({
                type: "image",
                src: image.url,
                width,
                height,
                // if position is available, show image on dropped place
                // or just show it in the center
                x: pos ? pos.x : store.width / 2 - width / 2,
                y: pos ? pos.y : store.height / 2 - height / 2,
              });
            }}
            rowsNumber={2}
            isLoading={isLoading}
            loadMore={false}
          />
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
    return (
      <>
        <p>Please connect your wallet</p>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div>{isError}</div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-normal">
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

      {isNftsError ? (
        <div>{isNftsError}</div>
      ) : (
        <ImagesGrid
          images={walletNFTImages}
          key={walletNFTImages}
          getPreview={(image) => image.url}
          onSelect={async (image, pos) => {
            const { width, height } = await getImageSize(image.url);
            store.activePage.addElement({
              type: "image",
              src: image.url,
              width,
              height,
              // if position is available, show image on dropped place
              // or just show it in the center
              x: pos ? pos.x : store.width / 2 - width / 2,
              y: pos ? pos.y : store.height / 2 - height / 2,
            });
          }}
          rowsNumber={2}
          isLoading={isLoading}
          loadMore={false}
        />
      )}

      {/* )} */}
    </>
  );
};
