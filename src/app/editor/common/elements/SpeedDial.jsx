// --------
// Speed Dial - Clear Canvas, Resize, etc.. Utility Functions
// Bottom Bar
// --------

import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";
import SuCreate from "@meronex/icons/su/SuCreate";
import SuChevronUp from "@meronex/icons/su/SuChevronUp";
import SuCapture from "@meronex/icons/su/SuCapture";
import { fnPageHasElements } from "../../../../utils";
import { useStore } from "../../../../hooks/polotno";
import { useContext } from "react";
import { Context } from "../../../../providers/context/ContextProvider";

export function SpeedDialX() {
  const store = useStore();
  const {
    contextCanvasIdRef,
    setPostDescription,
    setEnabled,
    setIsShareOpen,
    setMenu,
    referredFromRef,
    lensCollectRecipientRef,
    assetsRecipientRef,
    parentRecipientRef,
  } = useContext(Context);

  const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "text-sm absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4",
  };

  const fnCreateNewDesign = () => {
    // console.log("fnCreateNewDesign");
    if (fnPageHasElements) {
      // clear all the variables
      setPostDescription("");
      store.clear({ keepHistory: true });
      store.addPage();
      referredFromRef.current = [];
      lensCollectRecipientRef.current = [];
      assetsRecipientRef.current = [];
      parentRecipientRef.current = [];
      contextCanvasIdRef.current = null;
      setEnabled({
        chargeForCollect: false,
        chargeForCollectPrice: "1",
        chargeForCollectCurrency: "WMATIC",

        mirrorReferralReward: false,
        mirrorReferralRewardFee: 25.0,

        splitRevenueRecipients: [
          {
            recipient: "",
            split: 0.0,
          },
        ],

        limitedEdition: false,
        limitedEditionNumber: "1",

        timeLimit: false,
        endTimestamp: {
          date: "",
          time: "",
        },

        whoCanCollect: false,
      });

      setIsShareOpen(false);
      setMenu("share");
    } else {
      console.log("fnCreateNewDesign: No elements");
    }
  };

  return (
    <div className="relative h-10">
      <div className="md: absolute bottom-0 right-0">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="sm" className="rounded-full bg-white">
              <SuChevronUp className="h-5 w-5 transition-transform group-hover:rotate-90" />
            </IconButton>
          </SpeedDialHandler>

          {/* Content */}
          <SpeedDialContent>
            <div className="" onClick={() => store.setSize(1080, 1080)}>
              <SpeedDialAction className="relative">
                <SuCapture className="h-5 w-5" />
                <Typography {...labelProps}>{`Resize`}</Typography>
              </SpeedDialAction>
            </div>

            <div className="" onClick={() => fnCreateNewDesign()}>
              <SpeedDialAction className="relative">
                <SuCreate className="h-5 w-5" />
                <Typography {...labelProps}>{`Clear`}</Typography>
              </SpeedDialAction>
            </div>
          </SpeedDialContent>
        </SpeedDial>
      </div>
    </div>
  );
}
