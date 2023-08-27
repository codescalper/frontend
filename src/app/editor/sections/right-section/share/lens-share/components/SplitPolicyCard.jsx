import React from 'react'

export default function SplitPolicyCard() {
  return (
    <>
      <div className="h-18 mb-5 shadow-md bg-[url('/src/assets/pngs/SplitpolicyBG.png')] bg-origin-content bg-right bg-no-repeat rounded-xl">
            <div className="">
                <img className='h-8 pl-1' src="/src/assets/pngs/SplitpolicyHeader.png" alt="" />
            </div>
            <div className=" opacity-80 ml-4 m-1 text-xs">
            Some part of the split fee always goes to the <b>OG creator</b> of this template.
            </div>
      </div>
    </>
  )
}