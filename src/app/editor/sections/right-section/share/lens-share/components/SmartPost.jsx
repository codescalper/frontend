import { Switch } from "@headlessui/react";
import { Alert, Button, Option, Select } from "@material-tailwind/react";
import React, { useContext } from "react";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import { InputErrorMsg, NumberInputBox } from "../../../../../common";
import { ENVIRONMENT } from "../../../../../../../services";
import testnetTokenAddress from "../../../../../../../data/json/testnet-token-list.json";
import mainnetTokenAddress from "../../../../../../../data/json/mainnet-token-list.json";
import { LOCAL_STORAGE } from "../../../../../../../data";
import { getFromLocalStorage } from "../../../../../../../utils";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import LensAuth from "./LensAuth";
import LensDispatcher from "./LensDispatcher";

const SmartPost = () => {

  const {
    enabledSmartPost,
    setEnabledSmartPost,
    priceError,
    setPriceError,
    editionError,
    setEditionError,
  } = useContext(Context);

  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const getLensAuth = getFromLocalStorage(LOCAL_STORAGE.lensAuth);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "chargeForCollectPrice") {
      if (value < 0.1) {
        setPriceError({
          isError: true,
          message: "Price should be minimum 0.1",
        });
      } else {
        setPriceError({
          isError: false,
          message: "",
        });
        enabledSmartPost.chargeForCollectPrice = value;
      }
    } else if (name === "limitedEditionNumber") {
      if (value < 1) {
        setEditionError({
          isError: true,
          message: "Collect limit should be minimum 1",
        });
      } else {
        setEditionError({
          isError: false,
          message: "",
        });
        enabledSmartPost.limitedEditionNumber = value;
      }
    }
  };

  // get the list of tokens from json file
  const tokenList = () => {
    if (ENVIRONMENT === "localhost" || ENVIRONMENT === "development") {
      return testnetTokenAddress.tokens;
    } else {
      return mainnetTokenAddress.tokens;
    }
  };

  return (
    <>
      <div className="m-2">
        <Alert className="mt-2 mb-4 text-sm rounded-md border-l-4 border-[#E1F26C] bg-[#E1F26C]/10  text-[#96a535]">
          This Post will be shared through Open Actions on Lens
        </Alert>

        <Switch.Group>
          <div className="mb-4">
            <h2 className="text-lg mb-2">Charge for collecting</h2>
            <div className="flex justify-between">
              <Switch.Label className="w-4/5 opacity-50">
                Get paid when someone collects your post
              </Switch.Label>
              <Switch
                checked={enabledSmartPost.chargeForCollect}
                onChange={() => {
                  setEnabledSmartPost({
                    ...enabledSmartPost,
                    chargeForCollect: !enabledSmartPost.chargeForCollect,
                  });
                }}
                className={`${
                  enabledSmartPost.chargeForCollect
                    ? "bg-[#E1F26C]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    enabledSmartPost.chargeForCollect
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
            <div
              className={` ${!enabledSmartPost.chargeForCollect && "hidden"}`}
            >
              <div className="flex gap-5">
                <div className="flex flex-col py-2">
                  {/* <label htmlFor="price">Price</label> */}
                  <NumberInputBox
                    min={"1"}
                    step={"0.01"}
                    label="Price"
                    // placeholder="1"
                    name="chargeForCollectPrice"
                    onChange={(e) => handleChange(e)}
                    value={enabledSmartPost.chargeForCollectPrice}
                  />
                </div>
                <div className="flex flex-col py-2">
                  {/* <label htmlFor="price">Currency</label> */}
                  <Select
                    name="chargeForCollectCurrency"
                    id="chargeForCollectCurrency"
                    // className="border rounded-md py-[10px] outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={handleChange}
                    label="Currency"
                    value={enabledSmartPost.chargeForCollectCurrency}
                  >
                    {tokenList().map((token, index) => {
                      return (
                        <Option key={index} value={token.symbol}>
                          {token.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              {priceError.isError && (
                <InputErrorMsg message={priceError.message} />
              )}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg mb-2">Limited Edition</h2>
            <div className="flex justify-between">
              <Switch.Label className="w-4/5 opacity-60">
                Make the collects exclusive
              </Switch.Label>
              <Switch
                checked={enabledSmartPost.limitedEdition}
                onChange={() =>
                  setEnabledSmartPost({
                    ...enabledSmartPost,
                    limitedEdition: !enabledSmartPost.limitedEdition,
                  })
                }
                className={`${
                  enabledSmartPost.limitedEdition
                    ? "bg-[#E1F26C]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1F26C] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    enabledSmartPost.limitedEdition
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
            <div
              className={`flex ${!enabledSmartPost.limitedEdition && "hidden"}`}
            >
              <div className="flex flex-col w-full py-2 opacity-60">
                {/* <label htmlFor="price">Collect limit</label> */}
                <NumberInputBox
                  min={"1"}
                  step={"1"}
                  label={"Collect limit"}
                  // placeholder="1"
                  name="limitedEditionNumber"
                  onChange={(e) => handleChange(e)}
                  value={enabledSmartPost.limitedEditionNumber}
                />
                {editionError.isError && (
                  <InputErrorMsg message={editionError.message} />
                )}
              </div>
            </div>
          </div>
        </Switch.Group>

        {!getEVMAuth ? (
          <EVMWallets title="Login with EVM" className="mx-2" />
        ) : !getLensAuth?.profileHandle ? (
          <LensAuth title="Login with Lens" />
        ) : !getDispatcherStatus ? (
          <LensDispatcher title="Enable signless transactions" />
        ) : (
          <div className="mx-2 outline-none">
            <Button
              disabled={sharing}
              onClick={() => sharePost("lens")}
              // color="teal"
              className="bg-[#E1F26C]">
              Share Now
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SmartPost;
