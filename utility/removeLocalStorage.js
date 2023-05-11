// localStorage.removeItem("jwt-token");
// localStorage.removeItem("lens-auth");

// localStorage.getItem("jwt-token");
// localStorage.getItem("lens-auth");
function convertIPFSUrl(ipfsUrl) {
    const cid = ipfsUrl.replace('ipfs://', ''); // Remove 'ipfs://' prefix
    return `https://ipfs.io/ipfs/${cid}`;
  }
  
  // Usage
  const ipfsUrl = 'ipfs://bafybeifgutexjrmo3sovx2xitmbh6fs77kmacgvtseornpnftielglvfwi/w4q6NduVFj';
  const httpUrl = convertIPFSUrl(ipfsUrl);
  console.log(httpUrl);
  