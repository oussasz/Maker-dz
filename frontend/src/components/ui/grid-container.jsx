import React from "react";

const GridContainer = ({ children, cols = 5, rows = "auto", gap = 0 }) => {
  // Map cols to actual Tailwind classes
  const getGridCols = (colCount) => {
    const colsMap = {
      1: "grid-cols-1 md:grid-cols-1 lg:grid-cols-1",
      2: "grid-cols-1 md:grid-cols-1 lg:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
      7: "grid-cols-2 md:grid-cols-4 lg:grid-cols-7",
      8: "grid-cols-2 md:grid-cols-4 lg:grid-cols-8",
      9: "grid-cols-3 md:grid-cols-5 lg:grid-cols-9",
      10: "grid-cols-3 md:grid-cols-5 lg:grid-cols-10",
      11: "grid-cols-3 md:grid-cols-6 lg:grid-cols-11",
      12: "grid-cols-3 md:grid-cols-6 lg:grid-cols-12",
    };
    return colsMap[colCount] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
  };

  // Map rows to actual Tailwind classes
  const getGridRows = (rowCount) => {
    if (rowCount === "auto") return "";
    const rowsMap = {
      1: "grid-rows-1",
      2: "grid-rows-2",
      3: "grid-rows-3",
      4: "grid-rows-4",
      5: "grid-rows-5",
      6: "grid-rows-6",
    };
    return rowsMap[rowCount] || "";
  };

  // Map gap to actual Tailwind classes
  const getGapClass = (gapSize) => {
    if (gapSize === 0) return "";
    const gapMap = {
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      7: "gap-7",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
      20: "gap-20",
      24: "gap-24",
    };
    return gapMap[gapSize] || "gap-4";
  };

  const gridCols = getGridCols(cols);
  const gridRows = getGridRows(rows);
  const gapClass = getGapClass(gap);

  return (
    <div className={`grid ${gridCols} ${gridRows} ${gapClass}`}>
      {children}
    </div>
  );
};

export default GridContainer;