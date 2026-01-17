import React from 'react'

const Divider = ({ orientation="horizontal" }) => {
    return orientation === "horizontal" ? (
        <div className='w-full h-[1.5px] bg-gray-200' />
    ) : orientation === "vertical" ? (
        <div className='w-0.5 h-full bg-gray-200' />
    ) : null;
}

export default Divider