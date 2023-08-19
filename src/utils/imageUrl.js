export const convertIPFSUrl = (ipfsUrl) => {
  const cid = ipfsUrl.replace("ipfs://", ""); // Remove 'ipfs://' prefix
  return `https://ipfs.io/ipfs/${cid}`;
};

export const getImageUrl = (res) => {
  if (res === "ipfsLink" && res?.includes("ipfs://")) {
    ipfsLink = convertIPFSUrl(res);
    return ipfsLink;
  } else if (res === "permaLink") {
    return res;
  } else if (res === "imageURL") {
    return res;
  }
};
