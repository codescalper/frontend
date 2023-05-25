import { SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../editor-icon";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { getImageSize } from "polotno/utils/image";
import { InputGroup } from "@blueprintjs/core";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import {
  getAllCollection,
  getNFTs,
  getNftById,
  getNftByCollection,
  getCollectionNftById,
} from "../../services/backendApi";
import { useAccount } from "wagmi";
import { convertIPFSUrl, getImageUrl } from "../../services/imageUrl";

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
      {tab === "wallet" && !isConnected && (
        <div className="flex items-center justify-center h-full">
          <p>Please Connect your Wallet to see your NFTs</p>
        </div>
      )}
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
  const { address, isDisconnected } = useAccount();
  const [lenspostNFTImages, setLenspostNFTImages] = useState([]);
  const [collection, setCollection] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [nftId, setNftId] = useState("");
//   const CATEGORIES = ["Nouns", "Moonbirds", "CryptoPunks", "QQL"];
  const [activeCat, setActiveCat] = useState(null);

  const searchNFT = async () => {
    if (!activeCat) return;
    const res = await getCollectionNftById(nftId, contractAddress);
    let obj = {};
    let arr = [];
    if (res.ipfsLink?.includes("ipfs://")) {
      res.ipfsLink = convertIPFSUrl(res.ipfsLink);
      obj = { url: res[i].ipfsLink };
      arr.push(obj);
    } else {
      obj = { url: res.ipfsLink };
      arr.push(obj);
    }
    setLenspostNFTImages(arr);
    console.log("image", arr);

    // if (!nftId) {
    //   getNftByContractAddress();
    // }
  };

  const getNftByContractAddress = async () => {
    if (!contractAddress) return;
    const res = await getNftByCollection(contractAddress);
    const images = getImageUrl(res);
    setLenspostNFTImages(images);
  };
  // console.log("res", lenspostNFTImages);

  async function loadImages() {
    // here we should implement your own API requests
    const getCollections = await getAllCollection();
    setCollection(getCollections);
    // console.log("getCollections", getCollections);

    // for demo images are hard coded
    // in real app here will be something like JSON structure
    // setLenspostNFTImages([{ url: "/one.gif" }, { url: "/two.jpg" }]);
  }

  useEffect(() => {
    if (isDisconnected) return;

    searchNFT();
  }, [nftId]);

  useEffect(() => {
    if (isDisconnected) return;

    getNftByContractAddress();
  }, [contractAddress]);

  useEffect(() => {
    if (isDisconnected) return;

    loadImages();
  }, [address]);

  if (isDisconnected) {
    return (
      <>
        <p>Please connect the wallet</p>
      </>
    );
  }

  function RenderCategories() {
    return collection.map((item, index) => {
      return (
        <div className="" key={index}>
          <div
            className="flex items-center space-x-4 p-2 mb-4 cursor-pointer"
            onClick={() => (
              setContractAddress(item.address), setActiveCat(item.name)
            )}
          >
            <img
              src={item.image}
              alt={`${item}`}
              className="h-24 w-24 rounded-md"
            />
            <p className="text-lg font-normal">{item.name}</p>
          </div>
        </div>
      );
    });
  }

  function RenderImages() {
    return (
      <div className="">
        <div className="">
          <button onClick={() => goBack()}>go back</button>
          <h1 className="text-lg font-bold">{activeCat}</h1>
        </div>
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
          isLoading={!lenspostNFTImages.length}
          loadMore={false}
        />
      </div>
    );
  }

  function goBack() {
    setActiveCat(null);
  }

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <>
      <input
        className="mb-4 border px-2 py-1 rounded-md"
        placeholder="Search"
        onChange={(e) => {
          setNftId(e.target.value);
        }}
        value={nftId}
      />
	  <div className="overflow-y-auto">

      {activeCat === null ? <RenderCategories /> : <RenderImages />}
	  </div>

      {/* <RenderCategories />
			<RenderImages /> */}
    </>
  );
};

const WalletNFT = () => {
  const [walletNFTImages, setWalletNFTImages] = useState([]);
  const [nftId, setNftId] = useState("");
  const { address, isDisconnected } = useAccount();

  const searchNFT = async () => {
    let obj = {};
    let arr = [];
    const nftById = await getNftById(nftId);
    if (nftById) {
      nftById.permaLink = convertIPFSUrl(nftById.permaLink);
      obj = { url: nftById.permaLink };
      arr.push(obj);
    }
    setWalletNFTImages(arr);

    if (!nftId) {
      loadImages();
    }
  };

  async function loadImages() {
    // here we should implement your own API requests
    const res = await getNFTs(address);
    const images = getImageUrl(res);
    setWalletNFTImages(images);
  }

  useEffect(() => {
    if (isDisconnected) return;
    searchNFT();
  }, [nftId]);

  useEffect(() => {
    if (isDisconnected) return;
    loadImages();
  }, [address]);

  if (isDisconnected) {
    return (
      <>
        <p>Please connect the wallet</p>
      </>
    );
  }

  return (
    <>
      <input
        className="mb-4 border px-2 py-1 rounded-md"
        placeholder="Search"
        onChange={(e) => setNftId(e.target.value)}
        value={nftId}
      />
      {/* you can create yur own custom component here */}
      {/* but we will use built-in grid component */}
      {/* {walletNFTImages.length > 0 && ( */}

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
        isLoading={!walletNFTImages.length}
        loadMore={false}
      />
      {/* )} */}
    </>
  );
};
