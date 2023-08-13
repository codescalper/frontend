// ---- ----
// ---- Working yet - Under DEV - Created: 14Aug2023  Updated: ----
// ---- This section is the custom image upload section ----
// ---- ----

import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { SectionTab } from "polotno/side-panel";

import {  Spinner } from "@blueprintjs/core";

import { useAccount } from "wagmi";

import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  MessageComponent,
  SearchComponent,
} from "../../elements";
import {
    getAllCanvas,
  } from "../../services/backendApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UploadIcon } from "../editor-icon";

import {FileInput} from "@blueprintjs/core"



const CustomUploadPanel = observer(({ store }) => {
  const { isDisconnected, address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  

  const [query, setQuery] = useState("");

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-designs"],
    queryFn: getAllCanvas,
  });

//   const { data: publicTemplates } = useQuery({
//     queryKey: ["user-templates"],
//     queryFn: getUserPublicTemplates,
//   });

//   const {
//     mutate: deleteCanvas,
//     isError: isDeleteError,
//     error: deleteError,
//   } = useMutation({
//     mutationKey: "delete-canvas",
//     mutationFn: deleteCanvasById,
//     onSuccess: (data) => {
//       toast.success(data?.message);
//       queryClient.invalidateQueries(["my-designs"], { exact: true });
//     },
//     onError: (error) => {
//       toast.error(error);
//     },
//   });

//   const {
//     mutate: changeVisibility,
//     isError: isVisibilityError,
//     error: visibilityError,
//   } = useMutation({
//     mutationKey: "change-visibility",
//     mutationFn: changeCanvasVisibility,
//     onSuccess: (data) => {
//       toast.success(data?.message);
//       queryClient.invalidateQueries(["user-templates"], { exact: true });
//     },
//     onError: (error) => {
//       toast.error(error);
//     },
//   });

  if (isDisconnected || !address) {
    return (
      <div className="h-full flex flex-col">
        <h1 className="text-lg">Gallery</h1>
        <ConnectWalletMsgComponent />
      </div>
    );
  }

  // Show Loading - 06Jul2023
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg">Gallery</h1>

      {/* <SearchComponent onClick={false} query={""} setQuery={""} placeholder="Search designs by id" /> */}
        <div className="m-2 mt-4">
             <FileInput disabled={false} text="Choose file" fill buttonText="Upload" onInputChange={""} />       
        </div>
        
        <hr className="mt-4 mb-4"/>     

      {isError ? (
        <ErrorComponent error={error} />
      ) : data.length > 0 ? (<>
      
        
        <div className="m-2"> Recent Uploads</div>
        <div className="overflow-y-auto grid grid-cols-2">
          {data.map((design) => {
            return (
              <CustomImageComponent
                design={design}
                // json={design.data}
                preview={
                //   design?.imageLink != null &&
                //   design?.imageLink.length > 0 &&
                //   design?.imageLink[0]
                  design?.imageLink
                }
                key={design.id}
                store={store}
              />
            );  
          })}     
        </div>
        </>) : (
        <div>
          <MessageComponent message="You have not Uploaded any assets yet" />
        </div>
      )}

    </div>
  );
});


// define the new custom section
export const CustomUploadSection = {
  name: "Upload",
  Tab: (props) => (
    <SectionTab name="Upload" {...props}>
      <UploadIcon/>
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: CustomUploadPanel,
};
