import React from "react";

const CardTag = ({ color, children }) => {
  const colors = {
    red: "bg-red-600",
    green: "bg-green-600",
    blue: "bg-blue-600",
    black: "bg-black",
    amber: "bg-amber-600",
  };

  const bgColorClass = colors[color] || "bg-gray-600";
  return (
    <div
      className={`px-2 py-1 ${bgColorClass} text-white rounded-sm text-xs sm:text-sm`}
    >
      {children}
    </div>
  );
};

export default CardTag;
