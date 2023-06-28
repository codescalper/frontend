export const convertIPFSUrl = (ipfsUrl) => {
  const cid = ipfsUrl.replace("ipfs://", ""); // Remove 'ipfs://' prefix
  return `https://ipfs.io/ipfs/${cid}`;
};

export const getImageUrl = (res) => {
  let obj = {};
  let arr = [];
  for (let i = 0; i < res.length; i++) {
    if (res[i].ipfsLink?.includes("ipfs://")) {
      res[i].ipfsLink = convertIPFSUrl(res[i].ipfsLink);
      obj = { url: res[i].ipfsLink };
      arr.push(obj);
    } else if (res[i].permaLink?.includes("ipfs://")) {
      res[i].permaLink = convertIPFSUrl(res[i].permaLink);
      obj = { url: res[i].permaLink };
      arr.push(obj);
    } else if (res[i].imageURL) {
      obj = { url: res[i].imageURL };
      arr.push(obj);
    } else {
      obj = { url: res[i].ipfsLink };
      arr.push(obj);
    }
  }
  return arr;
};
