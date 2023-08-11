// --------
// This is the Modal component Reference : https://blueprintjs.com/docs/#core/components/dialog
// Params: store(built-in), json - if needed(else ignore), ModalTitle, ModalMessage, onClickFunction (call it as an arrow callback function )
// --------

import { useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter, Button } from "@blueprintjs/core";
import { fnLoadJsonOnPage } from "../utility/loadJsonOnPage";


// Dialog / Modal component start
export const CompModal = ({ store, json, ModalTitle, ModalMessage, onClickFunction}) => {
  const [stOpenedModal, setStOpenedModal] = useState(true);

  return (
    <Dialog
      title={ModalTitle}
      icon="issue"
      canOutsideClickClose={false}
      isOpen={stOpenedModal}
      // canOutsideClickClose="true"
      onClose={() => {setStOpenedModal(false)}}
    >
      <DialogBody>{ModalMessage}</DialogBody>
      <DialogFooter
        actions={
          <div>
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
            <Button
              text="No"
              onClick={() => {
                setStOpenedModal(false);
              }}
            />
          </div>
        }
      />
    </Dialog>
  );
};
