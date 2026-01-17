import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ cat }) => {
  return (
    <Link
      className="w-full flex flex-col items-center justify-center py-8 border border-black/30 rounded-lg hover:bg-gray-100 bg-white cursor-pointer duration-200"
      to={`products/categories/${cat.name}`}
    >
      <div className="h-12 mb-4">
        <cat.icon />
      </div>
      <h1>{cat.name}</h1>
    </Link>
  );
};

export default CategoryCard;
