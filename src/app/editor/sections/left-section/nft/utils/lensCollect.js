export const lensCollect = (title, id, item) => {
  if (title.split(".")[1] === "lens") {
    const match = title?.match(/@[\w.]+/);

    if (!match) return false;

    return {
      isLensCollect: true,
      lensHandle: match[0],
    };
  } else {
    return false;
  }
};
