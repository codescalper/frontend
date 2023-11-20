import React from 'react'

const ERC1155Edition = () => {
  return (
    <>
    {/* Switch Number 1 Start */}

    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2"> Set a Mint Price</h2>
        <Switch
          checked={zoraEnabled.isChargeForMint}
          onChange={() =>
            setZoraEnabled({
              ...zoraEnabled,
              isChargeForMint: !zoraEnabled.isChargeForMint,
            })
          }
          className={`${
            zoraEnabled.isChargeForMint
              ? "bg-[#00bcd4]"
              : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
        >
          <span
            className={`${
              zoraEnabled.isChargeForMint
                ? "translate-x-6"
                : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />{" "}
        </Switch>
      </div>
      <div className="w-4/5 opacity-75">
        {" "}
        Set an amount to be charged for minting{" "}
      </div>
    </div>

    <div
      className={`${!zoraEnabled.isChargeForMint && "hidden"} mx-4`}
    >
      <div className="flex">
        <div className="flex flex-col py-2">
          <NumberInputBox
            min={"1"}
            step={"0.01"}
            // className={"W-3/4"}
            label="Price [ETH]"
            name="chargeForMintPriceZora"
            value={zoraEnabled.chargeForMintPrice}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="flex flex-col py-2 mx-2">
          {/* <label htmlFor="price"></label> */}
          <Select
            label="Currency"
            name="chargeForMintCurrencyZora"
            id="chargeForMintCurrency"
            // className=" ml-4 p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
            onChange={(e) => handleChange(e)}
            value={zoraEnabled.chargeForMintCurrency}
          >
            <Option>ETH</Option>
          </Select>
        </div>
      </div>

      {zoraStatesError.isChargeForMintError && (
        <InputErrorMsg
          message={zoraStatesError.chargeForMintErrorMessage}
        />
      )}
    </div>

    {/* Switch Number 1 End */}

    {/* Splits Switch Start */}

    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2"> Royalty Splits </h2>
      </div>
      <div className="w-4/5 opacity-75">
        {" "}
        Set Royalty and auto reserve recipients{" "}
      </div>
    </div>

    <div className={`${!zoraEnabled.isRoyaltySplits && "hidden"}`}>
      <div className="mx-4">
        {zoraEnabled.royaltySplitRecipients.map(
          (recipient, index) => {
            return (
              <>
                <div
                  key={index}
                  className="flex justify-between gap-2 items-center w-full py-2"
                >
                  {/* <div className="flex justify-between items-center w-1/3"> */}
                  <InputBox
                    className="w-full"
                    label="Wallet Address"
                    value={recipient.address}
                    onChange={(e) =>
                      restrictRecipientInput(
                        e,
                        index,
                        recipient.address
                      )
                    }
                  />
                  {/* </div> */}
                  <div className="flex justify-between items-center w-1/3">
                    <NumberInputBox
                      className="w-4"
                      min={0}
                      max={100}
                      step={0.01}
                      label="%"
                      value={recipient.share}
                      onChange={(e) => {
                        handleRecipientChange(
                          index,
                          "share",
                          Number(
                            parseFloat(e.target.value).toFixed(2)
                          )
                        );
                      }}
                    />
                    {!restrictRemoveRecipientInputBox(
                      index,
                      recipient.address
                    ) && (
                      <XCircleIcon
                        className="h-6 w-6 cursor-pointer"
                        color="red"
                        onClick={() =>
                          removeRecipientInputBox(index)
                        }
                      />
                    )}
                  </div>
                </div>
              </>
            );
          }
        )}

        {zoraStatesError.isRoyaltySplitError && (
          <InputErrorMsg
            message={zoraStatesError.royaltySplitErrorMessage}
          />
        )}

        <Button
          color="cyan"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          onClick={addRecipientInputBox}
        >
          <BsPlus />
          Add Recipient
        </Button>
      </div>
    </div>
    {/* Splits Switch End */}

    {/* Switch Number 2 Start */}
    {currentTab === "ERC1155" && (
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2">
              {" "}
              Limit number of editions{" "}
            </h2>
            <Switch
              checked={zoraEnabled.isLimitedEdition}
              onChange={() =>
                setZoraEnabled({
                  ...zoraEnabled,
                  isLimitedEdition: !zoraEnabled.isLimitedEdition,
                })
              }
              className={`${
                zoraEnabled.isLimitedEdition
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraEnabled.isLimitedEdition
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Limit the number of editions that can be minted{" "}
          </div>
        </div>

        <div
          className={`${
            !zoraEnabled.isLimitedEdition && "hidden"
          } ml-4 mr-4`}
        >
          <div className="flex flex-col w-full py-2">
            <NumberInputBox
              min={"1"}
              step={"1"}
              label="Edition limit"
              name="limitedEditionNumber"
              onChange={(e) => handleChange(e)}
              value={zoraEnabled.limitedEditionNumber}
            />
            {zoraStatesError.isLimitedEditionError && (
              <InputErrorMsg
                message={zoraStatesError.limitedEditionErrorMessage}
              />
            )}
          </div>
        </div>
      </>
    )}
    {/* Switch Number 2 End */}

    {/* Switch Number 3 Start */}
    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2"> Limit mints per address </h2>
        <Switch
          checked={zoraEnabled.isMintLimitPerAddress}
          onChange={() =>
            setZoraEnabled({
              ...zoraEnabled,
              isMintLimitPerAddress:
                !zoraEnabled.isMintLimitPerAddress,
            })
          }
          className={`${
            zoraEnabled.isMintLimitPerAddress
              ? "bg-[#00bcd4]"
              : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
        >
          <span
            className={`${
              zoraEnabled.isMintLimitPerAddress
                ? "translate-x-6"
                : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />{" "}
        </Switch>
      </div>
      <div className="w-4/5 opacity-75">
        {" "}
        Limit the number of mints per address{" "}
      </div>
    </div>

    <div
      className={`${
        !zoraEnabled.isMintLimitPerAddress && "hidden"
      } ml-4 mr-4`}
    >
      <div className="flex flex-col w-full py-2">
        <NumberInputBox
          min={"1"}
          step={"1"}
          label="Mint limit"
          name="mintLimitPerAddress"
          onChange={(e) => handleChange(e)}
          value={zoraEnabled.mintLimitPerAddress}
        />
        {zoraStatesError.isMintLimitPerAddressError && (
          <InputErrorMsg
            message={zoraStatesError.limitedEditionErrorMessage}
          />
        )}
      </div>
    </div>
    {/* Switch Number 3 End */}

    {/* Switch Number 5 Start */}
    {currentTab === "ERC721" && (
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Set Royalty </h2>
            <Switch
              checked={zoraEnabled.isRoyaltyPercent}
              onChange={() =>
                setZoraEnabled({
                  ...zoraEnabled,
                  isRoyaltyPercent: !zoraEnabled.isRoyaltyPercent,
                })
              }
              className={`${
                zoraEnabled.isRoyaltyPercent
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraEnabled.isRoyaltyPercent
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set Royalty percentage for minting{" "}
          </div>
        </div>

        <div
          className={`${
            !zoraEnabled.isRoyaltyPercent && "hidden"
          } mx-4`}
        >
          {/* <div className="flex"> */}
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"0.01"}
              // className={"W-3/4"}
              label="Percentage ( % ) "
              name="setRoyaltyPercentZora"
              value={zoraEnabled.royaltyPercent}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* </div> */}

          {zoraStatesError.isRoyaltyPercentError && (
            <InputErrorMsg
              message={zoraStatesError.royaltyPercentErrorMessage}
            />
          )}
        </div>
      </>
    )}
    {/* Switch Number 5 End */}

    {/* Switch Number 6 Start */}
    {currentTab === "ERC721" && (
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Limit Supply </h2>
            <Switch
              checked={zoraEnabled.isMaxSupply}
              onChange={() =>
                setZoraEnabled({
                  ...zoraEnabled,
                  isMaxSupply: !zoraEnabled.isMaxSupply,
                })
              }
              className={`${
                zoraEnabled.isMaxSupply
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraEnabled.isMaxSupply
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set the maximum supply limit for the mint{" "}
          </div>
        </div>

        <div
          className={`${!zoraEnabled.isMaxSupply && "hidden"} mx-4`}
        >
          {/* <div className="flex"> */}
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"0.01"}
              // className={"W-3/4"}
              label="Max Supply "
              name="maxSupplyZora"
              value={zoraEnabled.maxSupply}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* </div> */}

          {zoraStatesError.isMaxSupplyError && (
            <InputErrorMsg
              message={zoraStatesError.maxSupplyErrorMessage}
            />
          )}
        </div>
      </>
    )}
    {/* Switch Number 6 End */}

    {/* Switch Number 4 Start */}
    {currentTab === "ERC1155" && (
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Schedule your Mint </h2>
            <Switch
              checked={zoraEnabled.isScheduleMint}
              onChange={() =>
                setZoraEnabled({
                  ...zoraEnabled,
                  isScheduleMint: !zoraEnabled.isScheduleMint,
                })
              }
              className={`${
                zoraEnabled.isScheduleMint
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraEnabled.isScheduleMint
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Schedule your mint{" "}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            !zoraEnabled.isScheduleMint && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <DateTimePicker onChange={onCalChange} />
          </div>

          {zoraStatesError.isScheduleMintError && (
            <InputErrorMsg
              message={zoraStatesError.scheduleMintErrorMessage}
            />
          )}
        </div>
      </>
    )}
    {/* Switch Number 4 End */}

    {/* Switch Number 7 Start */}
    {currentTab === "ERC721" && (
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Pre - Sale Schedule </h2>
            <Switch
              checked={zoraEnabled.isPresaleSchedule}
              onChange={() =>
                setZoraEnabled({
                  ...zoraEnabled,
                  isPresaleSchedule: !zoraEnabled.isPresaleSchedule,
                })
              }
              className={`${
                zoraEnabled.isPresaleSchedule
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraEnabled.isPresaleSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set a start and end date for your Presale schedule of
            the mint{" "}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            !zoraEnabled.isPresaleSchedule && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <div>Start</div>{" "}
            <DateTimePicker onChange={onCalChange} />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div> <DateTimePicker onChange={onCalChange} />
          </div>

          {zoraStatesError.isPresaleScheduleError && (
            <InputErrorMsg
              message={zoraStatesError.presaleScheduleErrorMessage}
            />
          )}
        </div>
      </>
    )}
    {/* Switch Number 7 End */}

    {/* Switch Number 8 Start */}
    {currentTab === "ERC721" && (
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2">
              {" "}
              Public - Sale Schedule{" "}
            </h2>
            <Switch
              checked={zoraEnabled.isPublicsaleSchedule}
              onChange={() =>
                setZoraEnabled({
                  ...zoraEnabled,
                  isPublicsaleSchedule:
                    !zoraEnabled.isPublicsaleSchedule,
                })
              }
              className={`${
                zoraEnabled.isPublicsaleSchedule
                  ? "bg-[#00bcd4]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraEnabled.isPublicsaleSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set a start and end date for your Public sale schedule
            of the mint{" "}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            !zoraEnabled.isPublicsaleSchedule && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <div>Start</div>{" "}
            <DateTimePicker onChange={onCalChange} />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div> <DateTimePicker onChange={onCalChange} />
          </div>

          {zoraStatesError.isPublicsaleScheduleError && (
            <InputErrorMsg
              message={
                zoraStatesError.publicsaleScheduleErrorMessage
              }
            />
          )}
        </div>
      </>
    )}
    {/* Switch Number 8 End */}

    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2">
          {" "}
          Customize Contract Details{" "}
        </h2>
        <Switch
          checked={zoraEnabled.isContractDetails}
          onChange={() =>
            setZoraEnabled({
              ...zoraEnabled,
              isContractDetails: !zoraEnabled.isContractDetails,
            })
          }
          className={`${
            zoraEnabled.isContractDetails
              ? "bg-[#00bcd4]"
              : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
        >
          <span
            className={`${
              zoraEnabled.isContractDetails
                ? "translate-x-6"
                : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />{" "}
        </Switch>
      </div>
      <div className="w-4/5 opacity-75">
        {" "}
        Set a Name and Symbol for the contract{" "}
      </div>
    </div>

    <div
      className={`${
        !zoraEnabled.isContractDetails && "hidden"
      } ml-4 mr-4`}
    >
      <div className="flex flex-col w-full py-2">
        {/* <label htmlFor="price">Collect limit</label> */}
        <InputBox
          label="Contract Name"
          name="contractName"
          onChange={(e) => handleChange(e)}
          value={zoraEnabled.contractName}
        />
        <div className="mt-2">
          <InputBox
            label="Contract Symbol"
            name="contractSymbol"
            onChange={(e) => handleChange(e)}
            value={zoraEnabled.contractSymbol}
          />
        </div>
        {zoraStatesError.isSellerFeeError && (
          <InputErrorMsg
            message={zoraStatesError.sellerFeeErrorMessage}
          />
        )}
      </div>
    </div>

    <div className="mx-2 my-4">
      <Button fullWidth color="cyan">
        {" "}
        Mint{" "}
      </Button>
    </div>
  </>
  )
}

export default ERC1155Edition