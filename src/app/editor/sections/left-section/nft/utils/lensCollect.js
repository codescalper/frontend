export const lensCollect = (title) => {
  if (title.split(".")[1] === "lens") {
    const match = title.match(/@[\w.]+/);

    return {
      isLensCollect: true,
      lensHandle: match[0],
    };
  } else {
    return false;
  }
};
