import React from "react";
import { Button } from "@blueprintjs/core";

const SearchComponent = ({ query, setQuery, onClick }) => {
  return (
    <div className="flex flex-row justify-between gap-2 my-4 mx-1">
      <input
        className="border px-2 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500 "
        placeholder="Search by Token ID"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      {onClick && (
        <Button
          icon="refresh"
          className="outline-none"
          onClick={onClick}
        ></Button>
      )}
    </div>
  );
};

export default SearchComponent;
