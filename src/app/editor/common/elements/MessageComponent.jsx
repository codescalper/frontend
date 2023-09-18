import Lottie from 'lottie-react'
import React from 'react'
import animationData from '../../../../assets/lottie/emptystates/emptyState1.json';

const MessageComponent = ({message}) => {
  return (
    <div className="flex flex-col justify-center items-center ">
      <Lottie animationData={animationData}/>
      <div className="text-center">
        <p className="text-gray-500 text-sm mt-4">{message}</p>
      </div>
    </div>
  )
}

export default MessageComponent