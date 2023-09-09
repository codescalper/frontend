import {
    IconButton,
    SpeedDial,
    SpeedDialHandler,
    SpeedDialContent,
    SpeedDialAction,
    Typography,
  } from "@material-tailwind/react";

  import SuCreate from '@meronex/icons/su/SuCreate';
  import SuChevronUp from '@meronex/icons/su/SuChevronUp';
  import { fnPageHasElements } from "../../utils"
  
  import { useStore } from "../../hooks";
  const store = useStore();

  export function SpeedDialX() {  

    const labelProps = {
      variant: "small",
      color: "blue-gray",
      className:
        "text-sm absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4",
    };
// No line break between elements using tailwind css
// https://stackoverflow.co m/questions/63804163/no-line-break-between-elements-using-tailwindcss


    const fnCreateNewDesign = () => {  
        // console.log("fnCreateNewDesign");
        if(fnPageHasElements){

          console.log("fnCreateNewDesign");
          store.clear({ keepHistory: true });
          store.addPage();
        
        }
        else{
          console.log("fnCreateNewDesign: No elements");
        }
    }   

    return (
      <div className="relative h-9">
        <div className="absolute bottom-0 right-0">
          <SpeedDial>
            <SpeedDialHandler>

              <IconButton size="sm" className="rounded-full bg-white">
                <SuChevronUp className="h-5 w-5 transition-transform group-hover:rotate-90" />
              </IconButton>

            </SpeedDialHandler>

            {/* Content */} 
            <SpeedDialContent>
            
            <div className="" onClick={()=> fnCreateNewDesign()}>
              <SpeedDialAction className="relative">
                <SuCreate className="h-5 w-5" />
                <Typography {...labelProps}>{`New Design`}</Typography>
              </SpeedDialAction>
            </div>
              
            </SpeedDialContent>
          </SpeedDial>
        </div>
      </div>
    );
  }