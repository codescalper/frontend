import React from "react";

const LoadMoreComponent = ({ hasNextPage, isFetchingNextPage }) => {
  return (
    <>
      {hasNextPage && (
        <div className="flex justify-center" id="bottom">
          {isFetchingNextPage && "Loading more..."}
        </div>
      )}
    </>
  );
};

export default LoadMoreComponent;
