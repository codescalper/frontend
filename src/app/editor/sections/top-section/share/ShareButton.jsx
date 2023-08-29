import { Fragment, useContext, useState } from "react";
import { ShareIcon } from "../../../../../assets";
import { Context } from "../../../../../context/ContextProvider";
import { LensShare, ShareSection } from "../../right-section";
import { Drawer } from "@blueprintjs/core"
import { useEffect } from "react";

// import { Dialog, Transition } from "@headlessui/react";
// Change from Dialog to Drawer [headlessui -> blueprintjs/core]

const ShareButton = () => { 

  const [transitionRtoL, setTransitionRtoL] = useState(false);

  const { menu, isShareOpen, setIsShareOpen } = useContext(Context);
  useEffect(() => {
    // setIsShareOpen(false)
    console.log("isShareOpen", isShareOpen)
  },[isShareOpen])
  
  const transitionCSS = {
    'transition-all': true,
    '-left-80 w-80': transitionRtoL,
    'left-0 w-80': !transitionRtoL,  
  }; 

  // const [position, setPosition] = useState('left'); // Initial position
 
  // const fnHandleTransition = () => {
  //   // Toggle position between 'left' and 'right'
  //   setPosition(position === 'left' ? 'right' : 'left');
  // };

  // useEffect(() => {
  //   fnHandleTransition();
  // }, []);
  
  return (
    <>
      <button onClick={() => setIsShareOpen(!isShareOpen)} className="outline-none">
        <ShareIcon />
      </button> 
      {/* <Transition.Root show={open} as={Fragment}> */}
      {/* <Drawer isOpen={open}>     */}
    
        <Drawer transitionDuration={200} isOpen={isShareOpen} canOutsideClickClose size={"small"} onClose={() => setIsShareOpen(false)} 
        className={`relative z-1000`}>
           
 
          {/* <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-0"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-0"
            leaveTo="opacity-0"
          > */}
            {/* <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" /> */}
            <div className="" />
          {/* </Transition.Child> */}

          {/* <div className="fixed inset-0 overflow-hidden"> */}
          <div className="fixed overflow-hidden">
            {/* <div className="absolute inset-0 overflow-scroll"> */}
            <div className="overflow-scroll">
              {/* <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 top-20"> */}
              <div className="fixed inset-y-0 right-0 flex max-w-full top-2">
                {/* <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                > */}
                  {/* <Drawer.Panel className="pointer-events-auto relative w-screen max-w-sm"> */}
                  <div className="w-screen max-w-sm mb-2">
                 
                  {/* <div className={`transition-transform duration-1000 ${
                       position === 'left' ? 'translate-x-full' : 'translate-x-0'
                    }`}> */}
                      {menu === "share" && <ShareSection />} 
                    {/* </div> */}

                    {/* <div className={`transition-transform duration-1000 ${
                       position === 'left' ? 'translate-x-full' : 'translate-x-0'
                    }`}> */}
                      {menu === "lensmonetization" && <LensShare />}     
                    {/* </div> */}

                  {/* </Drawer.Panel> */}
                  </div>
                {/* </Transition.Child> */}
              </div>
            </div>
          </div>
        </Drawer>
        {/* </Drawer>  */}
      {/* </Transition.Root> */}
    </>
  );
};

export default ShareButton;