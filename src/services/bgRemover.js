// --------
// This File is obsolete - Please ignore
// --------

// export const fnRemoveBackground = () =>{

// }

  // ------ ai_integration branch
  // Cutout pro API start

  const [file, setFile] = useState(null);
  const [imgResponse, setImgResponse] = useState(null);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState("");
  const [stActivePageNo, setStActivePageNo] = useState(0);
  const [stShowRemoveBgBtn, setStShowRemoveBgBtn] = useState(false);

  //   const handleFileChange = (event) => {
  // 		setFile(event.target.files[0]);
  // 		setFile(event.target.files[0]);
  //   };

  const handleRemoveBg = async () => {
    var varActivePageNo = 0;
    var base64String = "";
    console.log("Handle upload START");

    const formData = new FormData();
    // formData.append('file', file);
    formData.append("url", store.selectedElements[0].src);

    varActivePageNo = Number(fnFindPageNo())
    try {
      const response = await axios.get(
        // BG REMOVE from Cutout.pro,

        // For File use this Endpoint
        // 'https://www.cutout.pro/api/v1/matting?mattingType=6',

        // For Image `src` URL as parameter , use this Endpoint
        // `https://www.cutout.pro/api/v1/mattingByUrl?mattingType=6&url=${store.selectedElements[0].src}&crop=true`,
        "https://api.remove.bg/v1.0/removebg?image_url=",
        // 'https://www.cutout.pro/api/v1/text2imageAsync',
        {
          headers: {
            // APIKEY: "de13ee35bc2d4fbb80e9c618336b0f99",
            "X-API-Key": "2rNFJBVG7pVAY5WBAy8ovwVw"
            //  Backup API Keys :
            // 'APIKEY': 'c136635d69324c99942639424feea81a'
            // 'APIKEY': 'de13ee35bc2d4fbb80e9c618336b0f99' // rao2srinivasa@gmail.com
            // 'APIKEY': '63d61dd44f384a7c9ad3f05471e17130' //40 Credits
          },
        }
      )
     
      fnAddImageToCanvas(response?.data?.data?.imageUrl, varActivePageNo);
      console.log({image: response?.data?.data?.imageUrl});
      
      // console.log("The S3 Res is ")
      // fnStoreImageToS3(response?.data?.data?.imageUrl);
      
      // console.log("Deleting Previous images") // Under DEV - 08Jul2023
      // fnDeletePrevImage()
 
      return response?.data?.data?.imageUrl; //For toast
    } catch (error) {
      console.error(error);
    }
    console.log("Handle upload END");
  };

  // 03June2023

  // Find the index of the page for which the removed background image needs to be placed
  const fnFindPageNo = () => {
    return store.pages.map((page) => {
    page.identifier == store._activePageId;
    // setStActivePageNo(store.pages.indexOf(page));
    store.pages.indexOf(page);
  });
  }
    // Function to Add Removed BG image on the Canvas
  const fnAddImageToCanvas = (removedBgUrl, varActivePageNo) => {
    // Add the new removed Bg Image to the Page
    console.log(removedBgUrl);

    store.pages[stActivePageNo || varActivePageNo].addElement({
      type: "image",
      x: 0.5 * store.width,
      y: 0.5 * store.height,
      width: store.selectedElements[0].width,
      height: store.selectedElements[0].height,
      src: removedBgUrl,
      selectable: true,
      draggable: true,
      removable: true,
      resizable: true,
      showInExport: true,
    });
  };

  const fnStoreImageToS3 = async (removedBgUrl) =>{

    // return console.log(removedBgUrl);

    const res = await getRemovedBgS3Link(removedBgUrl);
    if(res?.data){
      console.log(res.data);
    }
    else if(res?.error) {
      console.log(res.error)
    }
  }

  // delete the Previous Image: - 26Jun2023
  const fnDeletePrevImage = async () =>{
    await store.deleteElements(store.selectedElements.map(x => x.id))
  }
  // Cutout pro API end

   //   const config = {
  //     headers: {
  //       'X-API-Key' : varApikey,
  //       // 'Content-Type': 'application/json',
  //       'Accept': 'application/json', // Specify the desired image format (e.g., image/png)
  //       // 'responseType': 'arraybuffer', // Set the responseType to 'arraybuffer' to receive binary data
  //     },
  //   }
    
  //   const data = {
  //     "image_url" : varImageUrl,
  //     "size" : "auto",
  //     "image_file_b64": "",
  //     "type": "auto",
  //     "type_level": "1",
  //     "format": "png",
  //     "roi": "0% 0% 100% 100%",
  //     "crop": false,
  //     "crop_margin": "0",
  //     "scale": "original",
  //     "position": "original",
  //     "channels": "rgba",
  //     "add_shadow": false,
  //     "semitransparency": true,
  //     "bg_color": "",
  //     "bg_image_url": ""
  //   }
    
  //   const apiUrl = `https://api.remove.bg/v1.0/removebg`;

  //   console.log(varImageUrl);

  //   try {
  //     const response = await axios.post(apiUrl, data, config);

  //     const removedBgUrl = `data:image/png;base64,${response.data.data.result_b64}`;
  //     console.log("The response Remove BG URL is");
  //     console.log(removedBgUrl)

  //     // console.log(removedBgUrl);
  //     //  // Convert the binary image data to a Blob
  //     // const blob = new Blob([response.data], { type: 'image/png' }); // Adjust the type based on the actual image format received

  //     // // Create a URL object from the Blob
  //     // const removedBgUrl = URL.createObjectURL(blob);

  //     // console.log("The Blob url is")
  //     // console.log(removedBgUrl)
      
  //     fnAddImageToCanvas(removedBgUrl, 0)

  //     console.log("The removed BG URL from S3 is")
  //     fnStoreImageToS3(removedBgUrl)

  //     // fnDeletePrevImage();
  //     return removedBgUrl;

  //   } catch (error) {
  //     console.error(error.response);
  //   }
  // };