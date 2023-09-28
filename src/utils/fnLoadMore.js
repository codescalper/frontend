// run this function only in useEffect if you want to load more data by scrolling to the bottom of the page
export const fnLoadMore = (hasNextPage, fetchNextPage) => {
  if (hasNextPage) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 } // Set threshold to 0.5 (50%)
    );
    observer.observe(document.querySelector("#bottom"));
    return () => observer.disconnect();
  }
};
