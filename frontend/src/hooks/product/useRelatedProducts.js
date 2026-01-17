import { useState, useEffect, useCallback } from "react";
import axios from "../../api/axios.js";

const useRelatedProducts = (product) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchRelatedProducts = useCallback(async (categories) => {
    if (!categories?.length) return;
    try {
      const res = await axios.get(`/products/categories/${categories[0].slug}`);
      const products = res.data.products;
      setRelatedProducts(products);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  }, []);

  useEffect(() => {
    if (product) {
        fetchRelatedProducts(product.categories);
    }
  }, [product, fetchRelatedProducts]);

  return { relatedProducts };
};

export default useRelatedProducts;
