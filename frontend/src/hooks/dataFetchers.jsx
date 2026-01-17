import useAxiosPrivate from "./useAxiosPrivate";

const dataFetchers = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchProduct = async (productId) => {
    try {
      const response = await axiosPrivate.get(`/products/${productId}`);
      const product = response.data;

      return { success: true, product };
    } catch (error) {
      return { success: false, error };
      console.error("Error fetching product:", error);
    }
  };

  return { fetchProduct };
};

export default dataFetchers;
