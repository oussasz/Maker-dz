import { create } from "zustand";

export const useProductModalStore = create((set) => ({
  isOpen: false,
  product: null,
  openProductModal: () => set({ isOpen: true }),
  closeProductModal: () => set({ isOpen: false }),
  setProduct: (product) => set({ product }),
  resetProduct: () => set({ product: null }),
}))
