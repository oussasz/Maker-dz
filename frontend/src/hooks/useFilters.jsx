import { useState, useCallback } from "react";

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

export const useFilters = (initialProducts = [], onFilterChange) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [customPrice, setCustomPrice] = useState({ min: "", max: "" });
  const [useCustomPrice, setUseCustomPrice] = useState(false);

  const toggleCategory = useCallback((category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

  const togglePriceRange = useCallback((index) => {
    setSelectedPriceRange((prev) => (prev === index ? null : index));
    setUseCustomPrice(false);
  }, []);

  const toggleCustomPrice = useCallback(() => {
    setUseCustomPrice((prev) => !prev);
    setSelectedPriceRange(null);
  }, []);

  const updateCustomPrice = useCallback((field, value) => {
    setCustomPrice((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...initialProducts];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories?.some((cat) => selectedCategories.includes(cat.name))
      );
    }

    // Filter by price
    if (useCustomPrice && customPrice.min && customPrice.max) {
      const min = parseFloat(customPrice.min);
      const max = parseFloat(customPrice.max);
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.basePrice);
        return price >= min && price <= max;
      });
    } else if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.basePrice);
        return price >= range.min && price <= range.max;
      });
    }

    onFilterChange?.(filtered);
    return filtered;
  }, [selectedCategories, selectedPriceRange, customPrice, useCustomPrice, initialProducts, onFilterChange]);

  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setCustomPrice({ min: "", max: "" });
    setUseCustomPrice(false);
    onFilterChange?.(initialProducts);
  }, [initialProducts, onFilterChange]);

  const activeFilterCount =
    selectedCategories.length +
    (selectedPriceRange !== null ? 1 : 0) +
    (useCustomPrice && customPrice.min && customPrice.max ? 1 : 0);

  return {
    // State
    selectedCategories,
    selectedPriceRange,
    customPrice,
    useCustomPrice,
    
    // Actions
    toggleCategory,
    togglePriceRange,
    toggleCustomPrice,
    updateCustomPrice,
    applyFilters,
    resetFilters,
    
    // Derived values
    activeFilterCount,
    categories: CATEGORIES,
    priceRanges: PRICE_RANGES,
  };
};