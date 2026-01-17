import React from "react";

const sizeClassesMap = {
  small: "px-6 py-2.5 gap-2 sm:text-xs text-2xs",
  medium: "sm:text-sm sm:px-8 gap-3 text-xs px-4 py-3",
  large: "text-base px-10 gap-4 py-4",
};

const responsiveSizeClasses = (size) => {
  if (typeof size === "string") {
    return sizeClassesMap[size] || sizeClassesMap["medium"];
  }

  if (typeof size === "object") {
    return Object.entries(size)
      .map(([breakpoint, value]) => {
        const prefix = breakpoint === "base" ? "" : `${breakpoint}:`;
        const classes = (sizeClassesMap[value] || "").split(" ");
        return classes.map((cls) => `${prefix}${cls}`).join(" ");
      })
      .join(" ");
  }

  return sizeClassesMap["medium"];
};

const MyButton = ({
  size = "medium",
  variant = "fill",
  fillWhite = false,
  fullWidth = false,
  grow = false,
  children = "",
  icon,
  start = false,
  end = false,
  onClick,
  className = ""
}) => {
  if (start && end) {
    throw new Error("IconButton: Only one of 'start' or 'end' can be true.");
  }
  

  const isIconOnly = children.trim() === "";

  return (
    <div
      className={`rounded-full ${className}
        ${fullWidth ? "w-full" : grow ? "flex-grow" : "w-fit"}
        cursor-pointer h-fit flex items-center justify-center font-semibold transition-all duration-200 
        ${
          fillWhite
            ? "bg-white text-primary hover:bg-gray-200"
            : variant === "text"
            ? "bg-transparent text-primary hover:text-hard-primary"
            : variant === "fill"
            ? "bg-primary text-white hover:bg-hard-primary"
            : variant === "outlined"
            ? "border-2 border-primary text-primary hover:border-hard-primary hover:text-hard-primary"
            : variant === "disabled"
            ? "bg-primary/10 text-primary hover:bg-hard-primary/20 hover:text-hard-primary"
            : ""
        }
        ${isIconOnly ? "h-10 w-10" : responsiveSizeClasses(size)}`}
      onClick={onClick}
    >
      {isIconOnly ? (
        icon
      ) : (
        <>
          {start && icon}
          <div>{children}</div>
          {end && icon}
        </>
      )}
    </div>
  );
};

export default MyButton;
