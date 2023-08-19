import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShareIcon } from "../../../../../assets";
import { LensMonetization, Share } from "../../components";
import { Context } from "../../../../../context/ContextProvider";

const ShareButton = () => {
  const [open, setOpen] = useState(false);
  const { menu, setMenu } = useContext(Context);

  return (
    <>
      <button onClick={() => setOpen(!open)} className="outline-none">
        <ShareIcon />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-0"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-0"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-scroll">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 top-20">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-sm">
                    {menu === "share" && <Share />}
                    {menu === "lensmonetization" && <LensMonetization />}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ShareButton;
