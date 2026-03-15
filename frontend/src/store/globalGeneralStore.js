import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGeneralStore = create(
  // persist(
  (set, get) => ({
    products: [],
    setProducts: (products) => set({ products }),
    getProductsByIds: (productsIds) => {
      const { products } = get();

      if (!productsIds || !Array.isArray(productsIds)) {
        return [];
      }

      const filteredProducts = products.filter((product) =>
        productsIds.includes(product.id),
      );

      return filteredProducts;
    },
  }),
  // {
  //   name: "general-storage",
  //   partialize: (state) => ({ products: state.products }),
  // }
  // )
);
