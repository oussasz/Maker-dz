import { create } from 'zustand';

const CATEGORIES = [
  "Men", "Women", "Gifts", "Decore", "Accessories", "Mats",
  "embroidery", "Aprons", "Kids", "Health & Beauty", "Bags & Purses",
  "Toys", "Craft Supplies & Tools", "Occasions Clothing", "Art",
];

const PRICE_RANGES = [
  { label: "Under 1,000", min: 0, max: 1000 },
  { label: "1,000 - 2,500", min: 1000, max: 2500 },
  { label: "2,500 - 5,000", min: 2500, max: 5000 },
  { label: "5,000 - 10,000", min: 5000, max: 10000 },
  { label: "Over 10,000", min: 10000, max: Infinity },
];

export const useFilterStore = create((set, get) => ({
  // State
  selectedCategories: [],
  selectedPriceRange: null,
  customPrice: { min: '', max: '' },
  useCustomPrice: false,
  
  // Constants
  categories: CATEGORIES,
  priceRanges: PRICE_RANGES,
  
  // Actions
  toggleCategory: (category) => {
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category]
    }));
  },
  
  togglePriceRange: (index) => {
    set({
      selectedPriceRange: get().selectedPriceRange === index ? null : index,
      useCustomPrice: false
    });
  },
  
  toggleCustomPrice: () => {
    set({
      useCustomPrice: !get().useCustomPrice,
      selectedPriceRange: null
    });
  },
  
  updateCustomPrice: (field, value) => {
    set((state) => ({
      customPrice: {
        ...state.customPrice,
        [field]: value
      }
    }));
  },
  
  resetFilters: () => {
    set({
      selectedCategories: [],
      selectedPriceRange: null,
      customPrice: { min: '', max: '' },
      useCustomPrice: false
    });
  },
  
  // Computed values
  getActiveFilterCount: () => {
    const state = get();
    return (
      state.selectedCategories.length +
      (state.selectedPriceRange !== null ? 1 : 0) +
      (state.useCustomPrice && state.customPrice.min && state.customPrice.max ? 1 : 0)
    );
  },
  
  // Filter products function
  applyFilters: (products) => {
    const state = get();
    let filtered = [...products];
    
    // Filter by categories
    if (state.selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories?.some((cat) => state.selectedCategories.includes(cat.name))
      );
    }
    
    // Filter by price
    if (state.useCustomPrice && state.customPrice.min && state.customPrice.max) {
      const min = parseFloat(state.customPrice.min);
      const max = parseFloat(state.customPrice.max);
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.basePrice);
        return price >= min && price <= max;
      });
    } else if (state.selectedPriceRange !== null) {
      const range = PRICE_RANGES[state.selectedPriceRange];
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.basePrice);
        return price >= range.min && price <= range.max;
      });
    }
    
    return filtered;
  }
}));