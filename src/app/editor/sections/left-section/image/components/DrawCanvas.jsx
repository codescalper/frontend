import React, { useState, useRef, useContext, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { CanvasPreview } from "./helpers-DrawCanvas/canvasPreview";
import { useDebounceEffect } from "./helpers-DrawCanvas/useDebounceEffect";
import { Context } from "../../../../../../providers/context";
import { Button, Textarea } from "@material-tailwind/react";
import { base64Stripper } from "../../../../../../utils";
import { CustomImageComponent } from "../../../../common";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
        height: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function DrawCanvas() {
  const { fastPreview } = useContext(Context);

  const [imgSrc, setImgSrc] = useState(fastPreview[0]);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [base64Image, setBase64Image] = useState(""); // New state to store base64 image
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);

  // AI API
  const [base64ImgLink, setBase64ImgLink] = useState(""); // For Newly generated Image Preview
  const [uploadedImg, setUploadedImg] = useState(); //For Uploaded Preview
  const [clicked, setClicked] = useState(false);
  const [stImgPrompt, setStImgPrompt] = useState(
    "A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters."
  );
  const [stDisplayMessage, setStDisplayMessage] = useState(
    "Choose an Image & Click on GENERATE to customize image based on your prompt"
  );

  // function onSelectFile(e) {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setCrop(undefined);
  //     const reader = new FileReader();
  //     reader.addEventListener("load", () =>
  //       setImgSrc(reader.result?.toString() || "")
  //     );
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function fnGenerateMagic() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    // Convert the blob to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result?.toString() || "";
      setUploadedImg(base64data);
      setBase64Image(base64data);

      // console.log("Base64 Image: ", base64data);
    };
    reader.readAsDataURL(blob);

    fnCallInstructImgAPI();
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        CanvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  // function handleToggleAspectClick() {
  //   if (aspect) {
  //     setAspect(undefined);
  //   } else {
  //     setAspect(16 / 9);

  //     if (imgRef.current) {
  //       const { width, height } = imgRef.current;
  //       const newCrop = centerAspectCrop(width, height, 16 / 9);
  //       setCrop(newCrop);
  //       setCompletedCrop(convertToPixelCrop(newCrop, width, height));
  //     }
  //   }
  // }

  // AI API
  const fnCallInstructImgAPI = async () => {
    setClicked(true);
    setBase64ImgLink("");

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization:
          "Bearer key-4tA8akcKtGFZQwipltBWJz3CCe1Jh6u7PX59uRJY9U6wEvareOdhlhWgCiMWnZeCz9CC6GIJLaddIJGbHr5crjfz6ROXTUXY",
        // "Bearer key-sHxl7Yj16bxvRWHfBQ8Yf73EuDNKKQjGARWaNhTEtqWtzQ4zfV9kiUQuf8kQdelwOX3UjuHuALXpyUQc6CFtB4zqqA0ym5l",
      },
      body: JSON.stringify({
        prompt: stImgPrompt,
        image: base64Stripper(uploadedImg),
      }),
    };

    console.log("Calling API Start");

    // await fetch("https://api.getimg.ai/v1/stable-diffusion/instruct", options)
    await fetch(
      "https://api.getimg.ai/v1/stable-diffusion/image-to-image",
      options
    )
      // await axios.post("https://api.getimg.ai/v1/stable-diffusion/instruct", options)
      .then((response) => response.json())
      .then((response) => {
        console.log(" Response from Fetch ");
        console.log(response);
        if (!response.image) {
          setBase64ImgLink("");
          setStDisplayMessage("It's not you, it's us. Please try again later.");
        }
        setClicked(false);
      })
      .catch((err) => {
        console.log("Response from Axios ");
        console.error(err);
        if (err.response.status == 401) {
          setBase64ImgLink("");
          setStDisplayMessage(err.response.data.error.type);
        }
      });
    setClicked(false);
    console.log("Calling API End");
  };

  useEffect(() => {
    setImgSrc(fastPreview[0]);
  }, [fastPreview]);
  s;
  return (
    <>
      <div className="flex flex-col w-full items-center justify-center align-middle">
        {/* <div className="Crop-Controls">
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div> */}

        <div className="">
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                cursor="move"
                alt="Crop me"
                src={imgSrc}
                style={{
                  width: "100%",
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
        {!!completedCrop && (
          <>
            <div className="">
              <canvas
                ref={previewCanvasRef}
                style={{
                  width: "100%",
                  border: "1px solid black",
                  objectFit: "contain",
                  // width: completedCrop.width,
                  height: completedCrop.height,
                  // marginTop: "-20px",
                }}
              />
            </div>
            <div className="mt-4 w-full">
              <Textarea
                className="w-full"
                required
                color="purple"
                label="Prompt"
                onChange={(e) => setStImgPrompt(e.target.value)}
              />
              <Button fullWidth onClick={fnGenerateMagic}>
                Generate Magic
              </Button>

              {!base64ImgLink && clicked && (
                <div className="mt-0 text-center text-blue-600">
                  {/* <Lottie animationData={animationData} className="h-64" /> */}
                  Generating Image...
                </div>
              )}

              {/* { base64ImgLink && <img className="mt-4" src={`data:image/jpeg;base64, ${base64ImgLink}`} alt="" /> } */}
              {base64ImgLink && !clicked && (
                <div className="mt-4 h-32">
                  <CustomImageComponent
                    preview={`data:image/jpeg;base64, ${base64ImgLink}`}
                  />
                  `Click to Add to Canvas`
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
