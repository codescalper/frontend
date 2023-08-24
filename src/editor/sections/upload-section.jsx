// ---- ----
// ---- Working yet - Under DEV - Created: 14Aug2023  Updated: ----
// ---- This section is the custom image upload section ----
// ---- ----

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { Spinner } from "@blueprintjs/core";
import { useAccount } from "wagmi";
import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  LoadMoreComponent,
  MessageComponent,
  UploadFileDropzone,
} from "../../elements";
import { deleteUserAsset, getUserAssets } from "../../services/backendApi";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UploadIcon } from "../editor-icon";
import { fnLoadMore } from "../../services/fnLoadMore";
import { fnMessage } from "../../services/fnMessage";
import { toast } from "react-toastify";

const CustomUploadPanel = observer(({ store }) => {
  const { isDisconnected, address } = useAccount();
  const queryClient = useQueryClient();

  // get all user assets
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["userAssets"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getUserAssets(pageParam),
    enabled: address ? true : false,
  });

  // delete user asset
  const {
    mutate: deleteAsset,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationKey: "delete-user-asset",
    mutationFn: deleteUserAsset,
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["userAssets"], { exact: true });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // delete error message
  useEffect(() => {
    if (isDeleteError) {
      toast.error(fnMessage(deleteError));
    }
  }, [isDeleteError]);

  // load more
  useEffect(() => {
    if (isDisconnected || !address) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (isDisconnected || !address) {
    return (
      <div className="h-full flex flex-col">
        <h1 className="text-lg">Upload Gallery</h1>
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
      <h1 className="text-lg">Upload Gallery</h1>

      <div className="m-2 mt-4">
        {/* DropZone component Start*/}
        <UploadFileDropzone />
        {/* DropZone component End*/}
      </div>

      <hr className="my-2" />
      {/* <SearchComponent onClick={false} query={""} setQuery={""} placeholder="Search designs by id" /> */}

      {isError ? (
        <ErrorComponent error={error} />
      ) : data?.pages[0]?.data.length > 0 ? (
        <>
          <div className="m-2"> Recent Uploads</div>
          <div className="overflow-y-auto grid grid-cols-2">
            {data?.pages
              .flatMap((item) => item?.data)
              .map((item, index) => {
                return (
                  <CustomImageComponent
                    design={item}
                    preview={item?.image}
                    key={index}
                    store={store}
                    hasOptionBtn={true}
                    onDelete={() => deleteAsset(item?.id)}
                  />
                );
              })}
          </div>
          <LoadMoreComponent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      ) : (
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
      <UploadIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: CustomUploadPanel,
};
