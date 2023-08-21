// --------
// This is the Modal component Reference : https://blueprintjs.com/docs/#core/components/dialog
// Params: store(built-in), json - if needed(else ignore), ModalTitle, ModalMessage, onClickFunction (call it as an arrow callback function )
// Input fields and customBtn is displayed if `tokengatingIp` & `customBtn` is set to TRUE by the calling Component
// --------

import { useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter, Button } from "@blueprintjs/core";

// Dialog / Modal component start
const CompModal = ({
  store,
  json,
  icon,
  ModalTitle,
  ModalMessage,
  customBtn,
  tokengatingIp,
  onClickFunction,
}) => {
  const [stOpenedModal, setStOpenedModal] = useState(true);
  const [stTokengateIpValue, setStTokengateIpValue] = useState("");

  return (
    <Dialog
      title={ModalTitle}
      icon={`${icon ? icon : "issue"}`}
      canOutsideClickClose={false}
      isOpen={stOpenedModal}
      // canOutsideClickClose="true"
      onClose={() => {
        setStOpenedModal(false);
      }}
    >
      <DialogBody>
        {ModalMessage}

        {/*  Show Input field if `tokengatingIp` === true. 
            i.e: Passed in the calling component */}

        {tokengatingIp && (
          <div className="">
            <input
              id="iDTokengateDesign" // For Fetching the value in MyDesigns in fnTokengateDesign
              className=" ml-0 mt-4 m-1 p-2 w-full border border-slate-400 rounded-md"
              type="text"
              value={stTokengateIpValue}
              onChange={(e) => setStTokengateIpValue(e.target.value)}
              placeholder={tokengatingIp}
            />
          </div>
        )}
      </DialogBody>

      <DialogFooter
        actions={
          <div>
            {!customBtn && (
              <Button
                intent="danger"
                text="Yes"
                onClick={() => {
                  console.log("clicked YES");
                  // Start
                  // fnLoadJsonOnPage(store, json);
                  onClickFunction();
                  // End
                  setStOpenedModal(false);
                }}
              />
            )}
            {!customBtn && (
              <Button
                text="No"
                onClick={() => {
                  setStOpenedModal(false);
                }}
              />
            )}

            {/* Show customBtns if `customBtn` === true */}
            {/* Or else show the above Yes & No btns */}

            {customBtn && (
              <Button
                className="px-8"
                intent="primary"
                text={customBtn}
                onClick={() => {
                  console.log(`clicked ${customBtn}`);
                  // Start
                  onClickFunction();
                  // End
                  setStOpenedModal(false);
                }}
              />
            )}
          </div>
        }
      />
    </Dialog>
  );
};

export default CompModal;
