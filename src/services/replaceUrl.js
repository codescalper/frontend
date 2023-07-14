export const replaceImageURL = (url) => {
  if (!url) return;

  if (url.includes("lenspost.s3.ap-south-1.amazonaws.com")) {
    const replacedURL = url.replace(
      "https://lenspost.s3.ap-south-1.amazonaws.com/",
      ""
    );
    return `http://lenspost.b-cdn.net/${replacedURL}`;
  } else if (url.includes("lenspost.s3.amazonaws.com")) {
    const replacedURL = url.replace("https://lenspost.s3.amazonaws.com/", "");
    return `http://lenspost.b-cdn.net/${replacedURL}`;
  } else if (url.includes("nft-cdn.alchemy.com")) {
    const replacedURL = url.replace("https://nft-cdn.alchemy.com/", "");
    return `http://lenspost-alchemy.b-cdn.net/${replacedURL}`;
  } else if (url.includes("ipfs.io")) {
    const replacedURL = url.replace("https://ipfs.io/ipfs/", "");
    return `http://lenspost-ipfs.b-cdn.net/${replacedURL}`;
  } else {
    return url;
  }
};
