// --------
// This is a custom horizontal scroller component
// Params to pass: `arrImages` is an object array of images to be displayed in the scroller,
// The object specific destructuring is to be done Ex: `arrImages.img` for Image, `arrImages.json` for JSON
// `propWidth` - width of the Image
// --------

import React, {useEffect, useRef, useState} from 'react'
import "./Styles/index.css"
import CustomImageComponent from '../CustomImageComponent'
import BsChevronLeft from '@meronex/icons/bs/BsChevronLeft';
import BsChevronRight from '@meronex/icons/bs/BsChevronRight';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedPropsAssets } from '../../../../../services';

const CustomHorizontalScroller = () => {

    const [arrImages, setArrImages] = useState();

    const { data , isLoading, isError, error } = useQuery({
        queryKey: ["featured-props"],
        queryFn: getFeaturedPropsAssets,
    });
    
    const scrollWrapperRef = useRef(null);

    // const scrollWrapper = document.getElementById('outsider');

    const distance = 300;
 
    const fnScrollLeft = () => {
        scrollWrapperRef.current.scrollBy({
            left: -distance,  
            behavior: 'smooth'
          });
    }
    const fnScrollRight = () => { 
        scrollWrapperRef.current.scrollBy({
            left: distance,
            behavior: 'smooth'      
          });
    }

    // Dummy Image Array :
    // const arrImages = [
    //     { img: "https://picsum.photos/200/200", id: "1"},
    //     { img: "https://picsum.photos/300/300", id: "2"},
    //     { img: "https://picsum.photos/400/400", id: "3"},
    //     { img: "https://picsum.photos/500/500", id: "4"},4
    // ]  

    useEffect(() => {

        console.log("featPropsData");  
        console.log(data); 

        setArrImages(data?.data?.assets);
    }, [data, isLoading]);   

    return (
    <>  
    <div className="sectionWrapper">

        {/* Left and Right Buttons */}
        <div className="btnsWrapper" id='new' >
            <div onClick={fnScrollLeft} id='button-left'> <BsChevronLeft/> </div>
            <div onClick={fnScrollRight} id='button-right'> <BsChevronRight/> </div>
        </div>

        {/* Images Inside the Horizontal scroller */}
        <div id="outsider" ref={scrollWrapperRef}>
            <div className="divsWrapper"  id="insider"> 
                {arrImages && arrImages.map((item, index) => {
                    return( 
                        <div id={index} className='eachDiv' 
                        // style={{"min-width":`${propWidth}px`, "max-height": `${propHeight}px`}}
                        > <CustomImageComponent dimensions={item.dimensions} preview={item.image}/> </div>
                        )  
                    }
                )}
            </div>
        </div>
    </div>
   
    </>
    )
    }

export default CustomHorizontalScroller;