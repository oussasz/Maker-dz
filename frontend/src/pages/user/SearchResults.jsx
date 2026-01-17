import React, { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { useParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown, Package } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
import FilterComponent from "../../components/common/Filter";
import { GridContainer } from "../../components/ui/index";
import ProductCard from "../../components/product/ProductCard";
import LoadingSpinner from "../../components/ui/loading-spinner";

const SearchResults = () => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [originalResults, setOriginalResults] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [display, setDisplay] = useState([]);
  const [sortBy, setSortBy] = useState("relevancy");
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    { value: "relevancy", label: "Relevancy" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
  ];

  const handleFilterData = (data) => {
    setDisplay(data);
    setSearchResults(data);
  };

  const handleSorting = (sortType) => {
    let sorted = [...searchResults];
    
    if (sortType === "price_low") {
      sorted.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortType === "price_high") {
      sorted.sort((a, b) => b.basePrice - a.basePrice);
    }
    
    setDisplay(sorted);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/products/search/searched?keyword=${query}`
        );
        setSearchResults(response.data.products);
        setDisplay(response.data.products);
        setOriginalResults(response.data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  useEffect(() => {
    handleSorting(sortBy);
  }, [sortBy, searchResults]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label;

  if (loading) {
    return <LoadingSpinner text={`Searching for "${query}"...`} />;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="w-full mx-auto px-4 sm:px-12 lg:px-20 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Search className="w-4 h-4" />
            <span>Search results</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            "{query}"
          </h1>
          <p className="text-gray-600">
            {display.length} {display.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* Filter Sheet */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80 py-4 px-0" forceMount>
                <FilterComponent
                  sendData={handleFilterData}
                  products={originalResults}
                />
              </SheetContent>
            </Sheet>

            <Badge variant="secondary" className="text-sm font-normal">
              {display.length} results
            </Badge>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-48">
                <span className="text-gray-600 text-sm">Sort by:</span>
                <span className="font-medium">{currentSortLabel}</span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="cursor-pointer"
                >
                  <span className={sortBy === option.value ? "font-semibold" : ""}>
                    {option.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Products Grid */}
        {display.length > 0 ? (
          <GridContainer cols={4} gap={5}>
            {display.map((prod) => (
              <ProductCard product={prod} key={prod._id} />
            ))}
          </GridContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any products matching "{query}". Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;