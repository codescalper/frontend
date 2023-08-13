// --------
// This is the Modal component Reference : https://blueprintjs.com/docs/#core/components/dialog
// Params: store(built-in), json - if needed(else ignore), ModalTitle, ModalMessage, onClickFunction (call it as an arrow callback function )
// --------

import { useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter, Button } from "@blueprintjs/core";
import { fnLoadJsonOnPage } from "../utility/loadJsonOnPage";


// Dialog / Modal component start
export const CompModal = ({ store, json, icon, ModalTitle, ModalMessage, customBtn, tokengatingIp, onClickFunction}) => {
  const [stOpenedModal, setStOpenedModal] = useState(true);

  return (
    <Dialog
      title={ModalTitle}
      icon={`${icon ? icon : "issue"}`}
      canOutsideClickClose={false}
      isOpen={stOpenedModal}
      // canOutsideClickClose="true"
      onClose={() => {setStOpenedModal(false)}}
    >
      <DialogBody>
        {ModalMessage}
        {tokengatingIp && <div className=""> <input className=" ml-0 mt-4 m-1 p-2 border border-slate-400 rounded-md" type="text" placeholder={tokengatingIp} /> </div>
        }
      </DialogBody>

      <DialogFooter
        actions={
          <div>
            {!customBtn &&
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
            }
            {!customBtn &&
              <Button
              text="No"
              onClick={() => {
                setStOpenedModal(false);
              }}
              />
            }
            {customBtn && 
             <Button
             intent="primary"
             text={customBtn}
             onClick={() => {
               console.log(`clicked ${customBtn}` );
               // Start
               // fnLoadJsonOnPage(store, json);
               onClickFunction();
               // End
               setStOpenedModal(false);
             }}
             />
             }
          </div>
        }
      />
    </Dialog>
  );
};
