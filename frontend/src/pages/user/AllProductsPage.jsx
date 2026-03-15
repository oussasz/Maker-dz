import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios.js";
import { Link } from "react-router-dom";
import {
  SlidersHorizontal,
  ChevronDown,
  Package,
  Search,
  Grid3X3,
  List,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../components/ui/sheet.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Separator } from "../../components/ui/separator.tsx";
import { Input } from "../../components/ui/input.tsx";
import FilterComponent from "../../components/common/Filter";
import { GridContainer } from "../../components/ui/index";
import ProductCard from "../../components/product/ProductCardEnhanced";
import LoadingSpinner from "../../components/ui/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";

const AllProductsPage = () => {
  const { t } = useTranslation("products");
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const sortOptions = [
    { value: "newest", label: t("sort.newest") },
    { value: "oldest", label: t("sort.oldest") },
    { value: "price_low", label: t("sort.price_low") },
    { value: "price_high", label: t("sort.price_high") },
    { value: "name_asc", label: t("sort.name_asc") },
    { value: "name_desc", label: t("sort.name_desc") },
  ];

  const handleFilterData = (data) => {
    setDisplayProducts(data);
    setProducts(data);
  };

  const handleSorting = (sortType) => {
    setSortBy(sortType);
    let sorted = [...products];

    switch (sortType) {
      case "price_low":
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price_high":
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }

    setDisplayProducts(sorted);
  };

  // Filter by search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return displayProducts;
    return displayProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [displayProducts, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/products");
        const fetchedProducts = response.data.products || response.data || [];
        setProducts(fetchedProducts);
        setDisplayProducts(fetchedProducts);
        setOriginalProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === sortBy,
  )?.label;

  if (loading) {
    return <LoadingSpinner text={t("loading")} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 inline mr-2" />
              {t("hero.badge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("hero.title_part1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {t("hero.title_part2")}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 h-14 text-lg border-gray-200 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </motion.div>

        <Separator className="mb-6" />

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            {/* Filter Sheet */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <Button asChild variant="outline" className="gap-2 h-11">
                <SheetTrigger>
                  <SlidersHorizontal className="w-4 h-4" />
                  {t("filters")}
                </SheetTrigger>
              </Button>

              <SheetContent side="left" className="w-80 py-4 px-0" forceMount>
                <FilterComponent
                  sendData={handleFilterData}
                  products={originalProducts}
                  onClose={() => setFilterOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <Badge
              variant="secondary"
              className="text-sm font-normal py-2 px-4"
            >
              {t("product_count", { count: filteredProducts.length })}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-48 h-11">
                  <span className="text-gray-600 text-sm">
                    {t("sort.label")}:
                  </span>
                  <span className="font-medium">{currentSortLabel}</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSorting(option.value)}
                    className="cursor-pointer"
                  >
                    <span
                      className={sortBy === option.value ? "font-semibold" : ""}
                    >
                      {option.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GridContainer cols={viewMode === "grid" ? 4 : 1} gap={6}>
                {filteredProducts.map((prod, index) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ProductCard product={prod} />
                  </motion.div>
                ))}
              </GridContainer>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-6">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm
                  ? t("no_products_found")
                  : t("no_products_available")}
              </h3>
              <p className="text-gray-500 max-w-md mb-8">
                {searchTerm
                  ? t("no_products_search", { term: searchTerm })
                  : t("marketplace_starting")}
              </p>
              {!searchTerm && (
                <Link to="/signup">
                  <Button className="gap-2">
                    {t("become_seller")}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllProductsPage;
