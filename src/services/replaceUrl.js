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
    } else {
      return url;
    }
  };