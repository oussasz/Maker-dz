import React from "react";

const IconButton = ({ icon, classes, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`transition-all duration-200 w-7 h-7 md:w-9 md:h-9 text-black rounded-full cursor-pointer border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white ${classes}`}
    >
      {React.cloneElement(icon, {
        className: `h-4 w-4 md:h-5 md:w-5 ${icon.props.className || ""}`,
      })}
    </div>
  );
};

export default IconButton;
