import { useState, useEffect, useCallback } from "react";
import axios from "../../api/axios.js";

const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState({ average: null, count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      setIsLoading(true);
      const productRes = await axios.get(`/products/${productId}`);
      setRating(productRes.data.averageRating);
      setProduct(productRes.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, rating, setRating, isLoading, error, refetch: fetchProduct };
};

export default useProduct;
