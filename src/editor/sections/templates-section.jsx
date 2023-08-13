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
import { Card } from "@blueprintjs/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  MessageComponent,
  SearchComponent,
} from "../../elements";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Spinner, Button, MenuItem, Menu, Icon } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { Context } from "../../context/ContextProvider";
import { CompModal } from "../../elements/ModalComponent";
import { fnLoadJsonOnPage } from "../../utility/loadJsonOnPage";

// Design card component start

const DesignCard = observer(
  ({ design, preview, json, onDelete, onPublic, tab }) => {
    // To check is the Modal is open or not
    const [isOpen, setIsOpen] = useState(false);
    const [isTokengated, setIsTokengated] = useState(true); // For Displaying the Tokengated Asset Icon
    const [stOpenTokengatedModal, setStOpenTokengatedModal] = useState(false); //For Modal Interaction

    return (
      <Card
        style={{ margin: "4px", padding: "0px", position: "relative" }}
        interactive
        onDragEnd={() => async () => {
        
        }}
        
        onClick={ async () => {
          
          // Show Modal: if it's tokengated
          if(isTokengated){
            setStOpenTokengatedModal(true)
          } 
          if(!isTokengated){
          // Check if there are any elements on the page - to open the Modal or not
          if(store.activePage.children.length > 1){ 
            setIsOpen(!isOpen)
          } 
          else{
          // If not load the clicked JSON 
            fnLoadJsonOnPage(store, json);
          }
        }
        }
      }
      >
      <div className="">
        <LazyLoadImage
          placeholderSrc={replaceImageURL(preview)}
          effect="blur"
          src={tab === "user" ? preview : replaceImageURL(preview)}
          alt="Preview Image"
        />
      </div>
      {
        isTokengated && 
        <div
        className="bg-white p-1 rounded-sm "
        style={{ position: "absolute", top: "8px", left: "8px" }}
        onClick={(e) => {
          e.stopPropagation();  
        }}
        >
          <Icon icon="endorsed" intent="primary" size={16} />
        </div>
      }
      {
      isTokengated && 
      stOpenTokengatedModal &&
      <CompModal 
          store={store} json={json}
          icon={"endorsed"}
          ModalTitle={"Access Restricted for this template"}
          ModalMessage={`
          This is a tokengated Template, Please collect this post to get Access.${""}
          https://opensea.io/collection/supducks
          `}            
          customBtn={"Visit Link"}
          // Example - Supducks Opensea Link
          onClickFunction = {()=> window.open("https://opensea.io/assets/ethereum/0x3fe1a4c1481c8351e91b64d5c398b159de07cbc5", "_blank")}
       />
      }  
      
        <div className="">
          <LazyLoadImage
            placeholderSrc={replaceImageURL(preview)}
            effect="blur"
            src={tab === "user" ? preview : replaceImageURL(preview)}
            alt="Preview Image"
          />
        </div>

        {isOpen && (
          <CompModal
            store={store}
            json={json}
            ModalTitle={
              "Are you sure to replace the canvas with this template?"
            }
            ModalMessage={"This will remove all the content from your canvas"}
            onClickFunction={() => fnLoadJsonOnPage(store, json)}
          />
        )}
      </Card>
    );
  }
);

// Design card component end

export const TemplatesPanel = observer(({ store }) => {
  const [tab, setTab] = useState("lenspost");
  const [stIsModalOpen, setStIsModalOpen] = useState(false);

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
          {/* User Templates */}
          Community Pool
        </button>
      </div>
      {tab === "lenspost" && <LenspostTemplates store={store} />}
      {tab === "user" && <UserTemplates store={store} />}
    </div>
  );
});

const LenspostTemplates = ({ store }) => {
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lenspost-templates"],
    queryFn: getAllTemplates,
  });

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

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
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder={"Search templates"}
      />
      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {data.length > 0 ? (
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
                tab="lenspost"
              />
            );
          })}
        </div>
      ) : (
        <MessageComponent message="No Results" />
      )}

      {/* New Design card end - 23Jun2023 */}
    </>
  );
};

const UserTemplates = ({ store }) => {
  const [stOpenedModal, setStOpenedModal] = useState(true);
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["user-templates"],
    queryFn: getUserPublicTemplates,
  });

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

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
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder={"Search templates"}
      />
      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {data?.length > 0 ? (
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
                tab="user"
              />
            );
          })}
        </div>
      ) : (
        <MessageComponent message="No Results" />
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
