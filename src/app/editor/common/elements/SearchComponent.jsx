import React from "react";
import { Button } from "@blueprintjs/core";

const SearchComponent = ({ query, setQuery, onClick, placeholder, error }) => {
  return (
    <div className="flex flex-col justify-between gap-2 my-4 mx-1">
      <div className="flex flex-row justify-between gap-2 mx-1">
        <input
          className="border px-2 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500 "
          placeholder={placeholder || "Search"}
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SearchComponent;
