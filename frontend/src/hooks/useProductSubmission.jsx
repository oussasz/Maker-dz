import { useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "../store/authStore";

/**
 * Builds FormData for product submission
 */
const buildProductFormData = (
  productData,
  productAttributes,
  variantOptions,
  variantVariables,
  variants,
  sellerId
) => {
  const formData = new FormData();
  const specsObject = Object.fromEntries(productAttributes.specifications);

  // Basic product fields
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("basePrice", productData.basePrice);
  formData.append("sellerId", sellerId);

  // JSON fields
  formData.append("categories", JSON.stringify(productAttributes.categories));
  formData.append("tags", JSON.stringify(productAttributes.tags));
  formData.append("specifications", JSON.stringify(specsObject));
  formData.append("variantOptions", JSON.stringify(variantOptions));
  formData.append("variantVariables", JSON.stringify(variantVariables));

  // Product images
  if (productData.images?.length) {
    productData.images.forEach((file) => {
      if (file instanceof File) {
        formData.append("productImages", file);
      }
    });
  }

  // Variants (without images in JSON)
  const variantsData = variants.map((variant, index) => ({
    ...variant,
    images: undefined,
    _index: index,
  }));
  formData.append("variants", JSON.stringify(variantsData));

  // Variant images
  variants.forEach((variant, index) => {
    if (variant.images?.length) {
      variant.images.forEach((img) => {
        if (img instanceof File) {
          formData.append(`variantImages_${index}`, img);
        }
      });
    }
  });

  return formData;
};

/**
 * Custom hook for product submission (add/update)
 */
export const useProductSubmission = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const addProduct = useCallback(
    async (
      productData,
      productAttributes,
      variantOptions,
      variantVariables,
      variants
    ) => {
      try {
        const formData = buildProductFormData(
          productData,
          productAttributes,
          variantOptions,
          variantVariables,
          variants,
          user.id
        );

        const response = await axiosPrivate.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error adding product:", error);
        return { success: false, error };
      }
    },
    [axiosPrivate, user.id]
  );

  const updateProduct = useCallback(
    async (
      productId,
      productData,
      variantOptions,
      variantVariables,
      variants,
      productAttributes
    ) => {
      try {
        const formData = buildProductFormData(
          productData,
          productAttributes,
          variantOptions,
          variantVariables,
          variants,
          user.id
        );

        const response = await axiosPrivate.put(
          `/products/${productId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, error };
      }
    },
    [axiosPrivate, user.id]
  );

  const getProductDetails = async (productId) => {
    try {
      const response = await axiosPrivate.get(`/products/${productId}`);
      const product = response.data;

      return { success: true, product };
    } catch (error) {
      console.error("Error fetching product:", error);
      return { success: false, error };
    }
  };

  return { addProduct, updateProduct, getProductDetails };
};
