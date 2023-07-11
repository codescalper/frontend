import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteAPI } from "polotno/utils/use-api";
import { SectionTab } from "polotno/side-panel";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { TemplatesIcon } from "../editor-icon";
import {
  getAllTemplates,
  getUserPublicTemplates,
} from "../../services/backendApi";
import { replaceImageURL } from "../../services/replaceUrl";
import { Context } from "wagmi";
import { Card } from "@blueprintjs/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ErrorComponent } from "../../elements";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Spinner } from "@blueprintjs/core";

// Design card component start

const DesignCard = observer(({ design, preview, json, onDelete, onPublic }) => {
  const { contextCanvasIdRef } = useContext(Context);
  return (
    <Card
      style={{ margin: "4px", padding: "0px", position: "relative" }}
      interactive
      onDragEnd={() => {
        store.loadJSON(json);
      }}
      onClick={() => {
        store.loadJSON(json);
        contextCanvasIdRef.current = design.id;
      }}
    >
      <div className="">
        <LazyLoadImage
          placeholderSrc={replaceImageURL(preview)}
          effect="blur"
          height={150}
          width={150}
          src={replaceImageURL(preview)}
          alt="Preview Image"
        />
      </div>
    </Card>
  );
});

// Design card component end

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
      {tab === "lenspost" && <LenspostTemplates store={store} />}
      {tab === "user" && <UserTemplates store={store} />}
    </div>
  );
});

const LenspostTemplates = ({ store }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lenspost-templates"],
    queryFn: getAllTemplates,
  });

  if (isError) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {data.length === 0 ? (
        <ErrorComponent message="No templates found" />
      ) : (
        <div className="overflow-y-auto grid grid-cols-2">
          {data.map((design) => {
            return (
              <DesignCard
                design={design}
                json={design.data}
                preview={design?.image}
                key={design.id}
                store={store}
                project={project}
              />
            );
          })}
        </div>
      )}

      {/* New Design card end - 23Jun2023 */}
    </>

  );

};

const UserTemplates = ({ store }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-templates"],
    queryFn: getUserPublicTemplates,
  });

  if (isError) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {data.length === 0 ? (
        <ErrorComponent message="No templates found" />
      ) : (
        <div className="overflow-y-auto grid grid-cols-2">
          {data.map((design) => {
            return (
              <DesignCard
                design={design}
                json={design.data}
                preview={
                  design?.imageLink != null &&
                  design?.imageLink.length > 0 &&
                  design?.imageLink[0]
                }
                key={design.id}
                store={store}
                project={project}
              />
            );
          })}
        </div>
      )}

      {/* New Design card end - 23Jun2023 */}
    </>
  );
};

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
