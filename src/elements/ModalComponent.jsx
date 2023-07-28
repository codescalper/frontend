import React, { useState } from 'react'
import {Dialog, DialogBody, DialogFooter, Button} from "@blueprintjs/core"

export default function ModalComponent(store, json, isOpen) {
    const [stOpenedModal, setStOpenedModal] = useState(isOpen);

  return (
    <Dialog
        title="Are you sure to use a new template?"
        icon="info-sign"
        isOpen={stOpenedModal}
        canOutsideClickClose="true"
        onClose={() => {
        setStOpenedModal(!stOpenedModal);
    }}
    >
    <DialogBody>This will replace all the content.</DialogBody>
    <DialogFooter
    actions={
        <div>
        <Button
            intent="danger"
            text="Yes"
            onClick={() => {
            store.loadJSON(json, true);
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
  )
}
