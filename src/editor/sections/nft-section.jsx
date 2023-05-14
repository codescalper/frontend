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

const NFTPanel = observer(({ store }) => {
  const [tab, setTab] = useState("lenspost");

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

const LenspostNFT = () => {
  const { address, isDisconnected } = useAccount();
  const [lenspostNFTImages, setLenspostNFTImages] = useState([]);
  const [collection, setCollection] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [visible, setVisible] = useState(false);
  const [nftId, setNftId] = useState("");

  const searchNFT = async () => {
    const res = await getCollectionNftById(nftId, contractAddress);
    console.log("res", res);

    if (!nftId) {
      getNftByContractAddress();
    }
  };

  const getNftByContractAddress = async () => {
    const res = await getNftByCollection(contractAddress);
    // setLenspostNFTImages(res);
    // console.log("res", res);
  };

  async function loadImages() {
    // here we should implement your own API requests
    const getCollections = await getAllCollection();
    setCollection(getCollections);
    // console.log("getCollections", getCollections);

    // for demo images are hard coded
    // in real app here will be something like JSON structure
    setLenspostNFTImages([{ url: "/one.gif" }, { url: "/two.jpg" }]);
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
      {/* you can create yur own custom component here */}
      {/* but we will use built-in grid component */}

      {!visible &&
        collection.length > 0 &&
        collection.map((item, index) => (
          <div
            key={item?.id}
            onClick={() => {
              setContractAddress(item?.address);
              setVisible(true);
            }}
            className="flex items-center gap-6 w-full cursor-pointer"
          >
            <img
              src="https://i.seadn.io/gcs/files/8c0ddbb72f2c23a894218174c8272b72.gif?auto=format&dpr=1&w=384"
              alt="title"
              className="w-1/2 rounded-md"
            />

            <p className="text-lg">{item?.name}</p>
          </div>
        ))}

      {visible && lenspostNFTImages?.length > 0 && (
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
      )}
    </>
  );
};

const WalletNFT = () => {
  const [walletNFTImages, setWalletNFTImages] = useState([]);
  const [nftId, setNftId] = useState("");
  const { address, isDisconnected } = useAccount();

  const convertIPFSUrl = (ipfsUrl) => {
    const cid = ipfsUrl.replace("ipfs://", ""); // Remove 'ipfs://' prefix
    return `https://ipfs.io/ipfs/${cid}`;
  };

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
    let obj = {};
    let arr = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i].permaLink.includes("ipfs://")) {
        res[i].permaLink = convertIPFSUrl(res[i].permaLink);
        obj = { url: res[i].permaLink };
        arr.push(obj);
      }
    }
    setWalletNFTImages(arr);
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
