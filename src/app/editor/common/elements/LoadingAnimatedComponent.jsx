import React from 'react'

import Lottie from "lottie-react"
import animationData from "../../../../assets/lottie/loaders/loadingAnimation.json" 
// import animationData from "../../../../assets/lottie/loaders/loadingAnimation3.json"

const LoadingAnimatedComponent = () =>{
  return (
    <>
      <div className="h-40 w-full flex flex-col align-middle text-center justify-center">
        <Lottie animationData={animationData} />
          {/* Almost there... */}
        </div>
    </>
  )
}
export default LoadingAnimatedComponent;