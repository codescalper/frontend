import { useState } from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { TemplatesIcon } from "../../../../../assets";
import {
  getAllTemplates,
  getUserPublicTemplates,
} from "../../../../../services";
import { Card } from "@blueprintjs/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ConnectWalletMsgComponent,
  CompModal,
  ErrorComponent,
  MessageComponent,
  SearchComponent,
} from "../../../common";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Spinner, Icon } from "@blueprintjs/core";
import { useStore } from "../../../../../hooks";
import { fnLoadJsonOnPage, replaceImageURL } from "../../../../../utils";

// Design card component start

const DesignCard = observer(
  ({ preview, json, tab, isGated, allowList, modal, setModal }) => {
    const store = useStore();
    const { address } = useAccount();
    const isAllowed = allowList?.includes(address);

    const handleClickOrDrop = () => {
      // Show Modal: if it's tokengated
      if (isGated && !isAllowed) {
        setModal({
          ...modal,
          isOpen: true,
          isTokengated: isGated,
        });
      } else {
        // Check if there are any elements on the page - to open the Modal or not
        if (store.activePage.children.length > 1) {
          setModal({
            ...modal,
            isOpen: true,
            isNewDesign: true,
            json: json,
          });
        } else {
          // If not load the clicked JSON
          fnLoadJsonOnPage(store, json);
        }
      }
    };

    return (
      <Card
        className="rounded-lg"
        style={{ margin: "4px", padding: "0px", position: "relative" }}
        interactive
        onDragEnd={handleClickOrDrop}
        onClick={handleClickOrDrop}
      >
        <div className="rounded-lg overflow-hidden">
          <LazyLoadImage
            className="rounded-lg"
            placeholderSrc={replaceImageURL(preview)}
            effect="blur"
            src={tab === "user" ? preview : replaceImageURL(preview)}
            alt="Preview Image"
          />
        </div>

        {/* if tab === "user" and  modal.isTokengate === true */}
        {tab === "user" && isGated && (
          <div
            className="bg-white p-1 rounded-lg "
            style={{ position: "absolute", top: "8px", left: "8px" }}
          >
            <Icon icon="endorsed" intent="primary" size={16} />
          </div>
        )}
      </Card>
    );
  }
);

// Design card component end

const TemplatePanel = () => {
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
      {tab === "lenspost" && <LenspostTemplates />}
      {tab === "user" && <UserTemplates />}
    </div>
  );
};

const LenspostTemplates = () => {
  const store = useStore();
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
          {data.map((item) => {
            return (
              <DesignCard
                json={item.data}
                preview={item?.image}
                key={item.id}
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

const UserTemplates = () => {
  const store = useStore();
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    isTokengated: false,
    isNewDesign: false,
    json: null,
  });
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["user-templates"],
    queryFn: getUserPublicTemplates,
    enabled: address ? true : false,
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
      {/* Show Modal only if it's tokengated, i.e: `isTokengated` & `stOpenTokengatedModal` === true */}
      {modal?.isOpen && modal?.isTokengated && (
        <CompModal
          modal={modal}
          setModal={setModal}
          icon={"disable"}
          ModalTitle={"Access Restricted for this template"}
          ModalMessage={`
          This is a tokengated Template, Please collect this post to get Access.${""}
          https://opensea.io/collection/supducks
          `}
        />
      )}

      {modal?.isOpen && modal?.isNewDesign && (
        <CompModal
          modal={modal}
          setModal={setModal}
          ModalTitle={"Are you sure to replace the canvas with this template?"}
          ModalMessage={"This will remove all the content from your canvas"}
          onClickFunction={() => {
            fnLoadJsonOnPage(store, modal?.json);
            setModal({
              isOpen: false,
              isTokengated: false,
              isNewDesign: false,
              json: null,
            });
          }}
        />
      )}
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
          {data.map((item) => {
            return (
              <DesignCard
                isGated={item.isGated}
                allowList={item.allowList}
                json={item.data}
                preview={
                  item?.imageLink != null &&
                  item?.imageLink.length > 0 &&
                  item?.imageLink[0]
                }
                key={item.id}
                tab="user"
                modal={modal}
                setModal={setModal}
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
const TemplateSection = {
  name: "Templates",
  Tab: (props) => (
    <SectionTab name="Templates" {...props}>
      <TemplatesIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: TemplatePanel,
};

export default TemplateSection;
