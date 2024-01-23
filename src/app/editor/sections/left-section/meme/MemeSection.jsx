// Imports:
import React, { useEffect, useState } from "react";
import { SectionTab } from "polotno/side-panel";
import AiOutlineFire from "@meronex/icons/ai/AiOutlineFire";
import { Button, IconButton, Input } from "@material-tailwind/react";
import {
  apiGetAllMemes,
  apiSearchMemes,
} from "../../../../../services/apis/meme-apis/memeApi";
import {
  CustomImageComponent,
  LoadingAnimatedComponent,
} from "../../../common";
import BiSearch from "@meronex/icons/bi/BiSearch";

export const MemePanel = () => {
  const [memeData, setMemeData] = useState([]);
  const [memeSearchKey, setMemeSearchKey] = useState("");
  const [loading, setLoading] = useState(false);

  const fnFetchAllMemes = async () => {
    setLoading(true);
    const res = await apiGetAllMemes();
    console.log(res.data.memes);
    setMemeData(res.data.memes);
    setLoading(false);
  };

  const fnSearchMemes = async () => {
    setLoading(true);

    const res = await apiSearchMemes(memeSearchKey);
    console.log(res?.data?.memes);
    setMemeData(res?.data?.memes);

    setLoading(false);
  };

  useEffect(() => {
    fnFetchAllMemes();
  }, []);

  return (
    <>
      <div className="h-full overflow-hidden">
        <div className="m-2 mb-4">
          <div className="flex gap-2">
            <Input
              value={memeSearchKey}
              onChange={(e) => setMemeSearchKey(e.target.value)}
              className=""
              label="Search Memes"
            />
            <IconButton onClick={() => fnSearchMemes()} variant="text">
              {" "}
              <BiSearch size={16} />{" "}
            </IconButton>
          </div>
        </div>
        {loading && <LoadingAnimatedComponent />}
        {!loading && (
          <div className=" h-full overflow-auto">
            <div className="columns-2 gap-1">
              {memeData?.map((item, index) => (
                <CustomImageComponent
                  key={index}
                  item={item}
                  // assetType={null}
                  // collectionName={null}
                  preview={item?.url}
                  dimensions={item?.dimensions != null && item.dimensions}
                  // hasOptionBtn={null}
                  // onDelete={null}
                  // isLensCollect={null}
                  // changeCanvasDimension={changeCanvasDimension}
                  // recipientWallet={item?.wallet}
                  // showAuthor={campaignName === "halloween" ? true : false}
                  // author={item?.author}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// define the new custom section
const MemeSection = {
  name: "Memes",
  Tab: (props) => (
    <SectionTab name={`Memes`} {...props}>
      <AiOutlineFire size={16} />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: MemePanel,
};

export default MemeSection;
