import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_LOCAL_URL } from "./services";
import { replaceImageURL } from "./utils";

const Test = () => {
  const [data, setData] = useState(null);

  const getData = async () => {
    const res = await axios.get(BACKEND_LOCAL_URL + "/public/templates?page=1");
    setData(res.data?.message);
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(data);

  return (
    <div className="p-3">
      <div className="grid-wrapper">
        {data?.map((item, index) => (
          <div key={index} className="">
            <img
            loading="lazy"
              src={replaceImageURL(item?.imageLink[0])}
              alt="image"
              className="max-w-full h-auto align-middle inline-block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
