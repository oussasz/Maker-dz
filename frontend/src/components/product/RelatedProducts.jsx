import React from "react";
import { GridContainer } from "../ui";
import ProductCard from "../ProductCard";


const RelatedProducts = ({ products }) => {
  return (
    <div className="suggestions">
      <div className="top">
        <h2>Related products:</h2>
      </div>
      <GridContainer cols={4} gap={5}>
        {
          products.map((prod) => (
            <ProductCard product={prod} key={prod.id} />
          ))
        }
      </GridContainer>
    </div>
  );
};

export default RelatedProducts;
