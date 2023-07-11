import React from 'react'

const MessageComponent = ({message}) => {
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <p className="text-gray-500 text-sm mt-4">{message}</p>
      </div>
    </div>
  )
}

export default MessageComponent