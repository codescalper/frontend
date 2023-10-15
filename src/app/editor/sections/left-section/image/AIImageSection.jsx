// ---- ----
// ---- Working yet - Under DEV - Created: 20Jul2023  Updated:27Jul2023 ----
// ---- This section is same as stable-diffusion-section.jsx ----
// ---- ----

import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { InputGroup, Button, Icon } from "@blueprintjs/core";
import { Tab, Tabs } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import FaBrain from "@meronex/icons/fa/FaBrain";
import { t } from "polotno/utils/l10n";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { useInfiniteAPI } from "polotno/utils/use-api";
import { getCrop } from "polotno/utils/image";
import { AIIcon } from "../../../../../assets";

// New imports:
import axios from "axios";
import FormData from "form-data";
import { useStore } from "../../../../../hooks";
import {
  CustomImageComponent,
  MessageComponent,
} from "../../../common";
import { Textarea, Button as MatButton, Input } from "@material-tailwind/react";
import { base64Stripper } from "../../../../../utils";
import Lottie from "lottie-react";
import animationData from "../../../../../assets/lottie/loaders/aiGeneration.json";

// Tab1 - Search Tab

const RANDOM_QUERIES = [
  "A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters.",
  "An otherworldly forest with bioluminescent plants and colorful creatures lurking in the shadows.",
  "Sea turtles gracefully gliding through the water, and a hidden shipwreck waiting to be explored.",
];

// This array is to display other queries on the frontend - 22Jul2023
const RANDOM_QUERIES2 = [
  // "A bustling marketplace in a medieval fantasy setting",
  "Merchants selling exotic goods and performers entertaining the crowd.",
  "An underwater paradise with coral reefs teeming with colorful fish",
];

// This array is to display short words as prompts on the frontend - 22Jul2023
const RANDOM_QUERIES3 = ["Mountains", "Hearts", "Robots", "NFTS", "Elon"];

const CompSearch = () => {
  const store = useStore();
  // load data
  const [data, setData] = useState(null);
  const [stStatusCode, setStStatusCode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [delayedQuery, setDelayedQuery] = useState(
    RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]
  );
  const [query, setQuery] = useState();
  // RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]
  // delayedQuery

  const requestTimeout = useRef();
  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 2000);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  const fnGenerateImages = () => {
    if (!delayedQuery) {
      return;
    }
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await axios.get(
          `https://lexica.art/api/v1/search?q=${delayedQuery}`
        );
        setStStatusCode(data.status);
        if (data.status === 200) {
          setStStatusCode(200);
          setData(data.data.images);
        } else if (data.status === 429) {
          setStStatusCode(429);
        }
      } catch (e) {
        console.log("There is an error");
        console.log(e);
        // setError(e);
        setError(e.message);
        setStStatusCode(429);
      }
      setIsLoading(false);
    }
    load();
  };
  useEffect(() => {
    fnGenerateImages();
  }, [delayedQuery]);

  return (
    <>
      <div className="">
        <div className="flex flex-col">
          <textarea
            className="h-16 mb-2 border px-4 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500"
            leftIcon="search"
            placeholder={query || "Search or Give a prompt"}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setQuery(e.target.value);
              }
            }}
            value={query}
            type="search"
          />
          {/* 
			<button className="bg-[#E1F26C] w-full px-4 p-1  mb-4 rounded-md hover:bg-[#e0f26cce]" onClick={fnGenerateImages}>Generate</button>
			*/}
        </div>
        <div className="flex flex-row overflow-x-scroll">
          {RANDOM_QUERIES3.map((val, key) => {
            return (
              <div
                onClick={() => setQuery(val)}
                className="m-1 mb-2 px-2 py-1 text-xs rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100"
              >
                {val}
              </div>
            );
          })}
        </div>

        {RANDOM_QUERIES2.map((val, key) => {
          return (
            <div
              onClick={() => setQuery(val)}
              className="m-1 mb-2 px-2 py-1 text-xs rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100 overflow-x-scroll"
            >
              {val}
            </div>
          );
        })}
      </div>

      {stStatusCode === 200 && (
        <ImagesGrid
          shadowEnabled={false}
          images={data}
          // Different URLs for Preview and Canvas (srcSmall and src)
          getPreview={(item) => item.srcSmall}
          isLoading={isLoading}
          error={error}
          onSelect={async (item, pos, element) => {
            if (element && element.type === "svg" && element.contentEditable) {
              element.set({ maskSrc: item.src });
              return;
            }

            const { width, height } = await getImageSize(item.src);

            if (
              element &&
              element.type === "image" &&
              element.contentEditable
            ) {
              const crop = getCrop(element, {
                width,
                height,
              });
              element.set({ src: item.src, ...crop });
              return;
            }
            const x = (pos?.x || store.width / 2) - width / 2;
            const y = (pos?.y || store.height / 2) - height / 2;
            store.activePage?.addElement({
              type: "image",
              src: item.src,
              width,
              height,
              x,
              y,
            });
          }}
          rowsNumber={2}
        />
      )}
      {stStatusCode === 429 && (
        // <div className="mt-4 p-2 text-orange-600 bg-orange-100 rounded-md">
        //   You are Rate limited for now, Please check back after 60s
        // </div>
        <MessageComponent message="You are Rate limited for now, Please check back after 60s" />
      )}
      {/* {!data && "Start exploring"} */}
    </>
  );
};

const CompDesignify = () => {
  const callApi = async () => {
    const form = new FormData();
    // Assuming you have access to the image file through a file input element.
    const fileInput = document.getElementById("fileInput");
    form.append("image_file", fileInput.files[0]);

    try {
      const response = await axios({
        method: "post",
        url: "https://api.designify.com/v1.0/designify/:designId",
        data: form,
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "multipart/form-data",
          // "X-Api-Key": "9822b7f73ff3bea87eee20370ac3982e",
          "X-Api-Key": "2f9772c386495a636efc72709d1a312f",
        },
      });

      if (response.status !== 200) {
        console.error("Error:", response.status, response.statusText);
      } else {
        // Assuming you want to display the image or do something else with it.
        // For example, displaying it in an <img> tag:
        const blob = new Blob([response.data], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);
        const imageElement = document.getElementById("imageElement");
        imageElement.src = imageUrl;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* Input element for selecting the image file */}
      <input type="file" id="fileInput" />
      {/* Image element to display the retrieved image */}
      <img id="imageElement" src="" alt="Design" />
      <button onClick={callApi}>Generate</button>
    </div>
  );
};

const CompInstructImage = () => {
  const [base64ImgLink, setBase64ImgLink] = useState(""); // For Newly generated Image Preview
  const [imageBase64, setImageBase64] = useState(""); //For Uploaded Preview
  const [clicked, setClicked] = useState(false);
  const [stImgPrompt, setStImgPrompt] = useState(
    "A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters."
  );
  const [stDisplayMessage, setStDisplayMessage] = useState(
    "Choose an Image & Click on GENERATE to customize image based on your prompt"
  );

  console.log("In CompInstructImage");

  // Testing all the APIs from getimg.ai

  const fnCallInstructImgAPI = async () => {
    setClicked(true);
    setBase64ImgLink("");

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        'content-type': "application/json",
        authorization: "Bearer key-SQPbl4vBrLiOoEe1szionhtBfhqvtLvCOb6y2Sw0cW9fRPj1AidOkbmuCM68IEpaOCkJ9H7lWkEBBe1JqEQqn05rX08AN8p",
      },
      body: JSON.stringify({
      // data: {
        prompt: stImgPrompt,
        image: base64Stripper(imageBase64),
      } 
      ),
    };

    console.log("Calling API Start");

    await fetch("https://api.getimg.ai/v1/stable-diffusion/instruct", options)
    // await axios.post("https://api.getimg.ai/v1/stable-diffusion/instruct", options)
      // .then((response) => response.json())
      .then((response) => {
        console.log(" Response from Axios ");
        console.log(response);
        // if (response.status === 200) {
          setBase64ImgLink(response.data.image);
        // }
      })
      .catch((err) => {
        console.log(" Response from Axios ");
        console.error(err);
        if (err.response.status == 401) {
          setBase64ImgLink("");
          setStDisplayMessage(err.response.data.error.type);
        }
      });
    setClicked(false);
    console.log("Calling API End");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // When the file has been read successfully, the result will be a Base64 encoded string
        const base64String = reader.result;
        setImageBase64(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Set Image to State Variable
    console.log(stImgPrompt);
    console.log(imageBase64);

    // convertImageToBase64(stOriginalImage, (base64Img) => {
    //   console.log(base64Img);
    //   setStOriginalImage(base64Img);
    // } );
    console.log(Date.now() - 1 * 60 * 1000);
  }, [imageBase64]);

  return (
    <>
    <div className="h-full overflow-y-auto">
      <div className="">
        <div className="m-1 mb-2 ml-2"> Original Image </div>

        {/* <Input onChange={(e) => setStOriginalImage(e.target.value)} type="file" name="" id="" accept="image/*" /> */}
        <div className="mb-4 rounded-md">
          <input
            className="mb-2 ml-2"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imageBase64 && (
            <div className="flex justify-center">
              <img
                className="m-2 rounded-md h-32 w-full object-contain"
                src={imageBase64}
                alt="Uploaded Image"
              />
            </div>
          )}
        </div>
      </div>

      <Textarea
        required
        color="purple"
        label="Prompt"
        onChange={(e) => setStImgPrompt(e.target.value)}
      />

      <MatButton disabled={!imageBase64} className="mt-4 w-full" onClick={fnCallInstructImgAPI}>
        Generate
      </MatButton>

      {!base64ImgLink && !clicked && (
        <div className="mt-4 text-center text-md text-green-600">
          {stDisplayMessage}
        </div>
      )}

      {!base64ImgLink && clicked && (
        <div className="mt-0 text-center text-blue-600">
          <Lottie animationData={animationData} className="h-64" />
          {/* Generating Image... */}
        </div>
      )}

      {/* { base64ImgLink && <img className="mt-4" src={`data:image/jpeg;base64, ${base64ImgLink}`} alt="" /> } */}
      {base64ImgLink && (
        <div className="mt-4 h-32">
          <CustomImageComponent
            preview={`data:image/jpeg;base64, ${base64ImgLink}`}
          />
        </div>
      )}
      </div>
    </>
  );
};

const AIImagePanel = () => {
  const [currentTab, setCurrentTab] = useState("tabPrompt");

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        id="TabsExample"
        defaultSelectedTabId="tabPrompt"
        onChange={(tabId) => {
          setCurrentTab(tabId);
        }}
      >
        <Tab id="tabPrompt" title="Prompt" />
        {/* <Tab id="tabDesignify" title="Designify" /> */}
        <Tab id="tabInstructImage" title="Instruct" />
      </Tabs>

      <div
        style={{
          height: "calc(100% - 20px)",
          display: "flex",
          flexDirection: "column",
          paddingTop: "20px",
        }}
      >
        {currentTab === "tabPrompt" && <CompSearch />}
        {currentTab === "tabDesignify" && <CompDesignify />}
        {currentTab === "tabInstructImage" && <CompInstructImage />}
      </div>
    </div>
  );
};

// define the new custom section
const AIImageSection = {
  name: "AIImage",
  Tab: (props) => (
    <SectionTab name="AI Image" {...props}>
      <AIIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: AIImagePanel,
};

export default AIImageSection;
