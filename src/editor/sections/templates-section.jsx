import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteAPI } from "polotno/utils/use-api";

import { SectionTab } from "polotno/side-panel";
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";

import { ImagesGrid } from "polotno/side-panel/images-grid";
import { TemplatesIcon } from "../editor-icon";
import { getAllTemplates } from "../../services/backendApi";

export const TemplatesPanel = observer(({ store }) => {
  const [tab, setTab] = useState("lenspost");

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg">Templates</h1>
      <div className="flex items-center justify-center space-x-2 my-4">
        <button
          className={`w-1/2 border px-2 py-1 border-black rounded-md ${
            tab === "lenspost" && "bg-[#1B1A1D]"
          } ${tab === "lenspost" && "text-white"}`}
          onClick={() => setTab("lenspost")}
        >
          Lenspost Templates
        </button>
        <button
          className={`w-1/2 border border-black px-2 py-1 rounded-md ${
            tab === "user" && "bg-[#1B1A1D]"
          } ${tab === "user" && "text-white"}`}
          onClick={() => setTab("user")}
        >
          User Templates
        </button>
      </div>
      {tab === "lenspost" && <LenspostTemplates />}
      {tab === "user" && <UserTemplates />}
    </div>
  );
});

const LenspostTemplates = observer(({ store }) => {
  // load data
  const { data, isLoading } = useInfiniteAPI({
    getAPI: ({ page }) => `templates/page${page}.json`,
  });

  const res = async () => {
    await getAllTemplates().then((res) => console.log("res", res));
  };

  res();

  return (
    <div style={{ height: "100%" }}>
      <p>lenspost templates -- remove later</p>
      <ImagesGrid
        shadowEnabled={false}
        images={data?.map((data) => data.items).flat()}
        getPreview={(item) => `/templates/${item.preview}`}
        isLoading={isLoading}
        onSelect={async (item) => {
          // download selected json
          const req = await fetch(`/templates/${item.json}`);
          const json = await req.json();
          // just inject it into store
          store.loadJSON(json);
        }}
        rowsNumber={1}
      />
    </div>
  );
});

const UserTemplates = observer(({ store }) => {
  // load data
  const { data, isLoading } = useInfiniteAPI({
    getAPI: ({ page }) => `templates/page${page}.json`,
  });

  return (
    <div style={{ height: "100%" }}>
      <p>user public templates -- remove later</p>

      <ImagesGrid
        shadowEnabled={false}
        images={data?.map((data) => data.items).flat()}
        getPreview={(item) => `/templates/${item.preview}`}
        isLoading={isLoading}
        onSelect={async (item) => {
          // download selected json
          const req = await fetch(`/templates/${item.json}`);
          const json = await req.json();
          // just inject it into store
          store.loadJSON(json);
        }}
        rowsNumber={1}
      />
    </div>
  );
});

// define the new custom section
export const TemplatesSection = {
  name: "Templates",
  Tab: (props) => (
    <SectionTab name="Templates" {...props}>
      <TemplatesIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: TemplatesPanel,
};
