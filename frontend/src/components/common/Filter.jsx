import React, { useState } from "react";
import { RotateCcw, Check, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useFilterStore } from "../../store/filtersStore";

const FilterComponent = ({ sendData, products, onClose }) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true
  });
  
  const {
    selectedCategories,
    selectedPriceRange,
    customPrice,
    useCustomPrice,
    categories,
    priceRanges,
    toggleCategory,
    togglePriceRange,
    toggleCustomPrice,
    updateCustomPrice,
    resetFilters,
    getActiveFilterCount,
    applyFilters
  } = useFilterStore();

  const handleApply = () => {
    const filtered = applyFilters(products);
    sendData(filtered);
    onClose?.();
  };

  const handleReset = () => {
    resetFilters();
    sendData(products);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeFilterCount = getActiveFilterCount();

  // Quick category badges for selected categories
  const SelectedCategoryBadges = () => {
    if (selectedCategories.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mb-3">
        {selectedCategories.map(category => (
          <Badge 
            key={category} 
            variant="secondary" 
            className="text-xs px-2 py-1 flex items-center gap-1"
          >
            {category}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={() => toggleCategory(category)}
            />
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Categories Section */}
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('categories')}
            >
              <h3 className="font-medium text-base flex items-center gap-2">
                Categories
                {selectedCategories.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {selectedCategories.length}
                  </Badge>
                )}
              </h3>
              {openSections.categories ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>

            {openSections.categories && (
              <>
                <SelectedCategoryBadges />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-3 py-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor={`cat-${category}`}
                        className="text-sm font-normal cursor-pointer flex-1 hover:text-primary transition-colors"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Price Range Section */}
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('price')}
            >
              <h3 className="font-medium text-base">Price Range</h3>
              {openSections.price ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>

            {openSections.price && (
              <div className="space-y-4">
                {/* Predefined Price Ranges */}
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <div key={idx} className="flex items-center space-x-3 py-1">
                      <Checkbox
                        id={`price-${idx}`}
                        checked={selectedPriceRange === idx}
                        onCheckedChange={() => togglePriceRange(idx)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor={`price-${idx}`}
                        className="text-sm font-normal cursor-pointer flex-1 hover:text-primary transition-colors"
                      >
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Custom Price Range */}
                <div className="pt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <Checkbox
                      id="custom-price"
                      checked={useCustomPrice}
                      onCheckedChange={toggleCustomPrice}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor="custom-price"
                      className="text-sm font-normal cursor-pointer flex-1 hover:text-primary transition-colors"
                    >
                      Custom Range
                    </Label>
                  </div>

                  {useCustomPrice && (
                    <div className="space-y-3 p-3 bg-muted/50 rounded-lg border">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="min-price" className="text-xs font-medium">
                            Min Price
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                              ₹
                            </span>
                            <Input
                              id="min-price"
                              type="number"
                              placeholder="0"
                              value={customPrice.min}
                              onChange={(e) => updateCustomPrice("min", e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-price" className="text-xs font-medium">
                            Max Price
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                              ₹
                            </span>
                            <Input
                              id="max-price"
                              type="number"
                              placeholder="10000"
                              value={customPrice.max}
                              onChange={(e) => updateCustomPrice("max", e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                      </div>
                      {(customPrice.min || customPrice.max) && (
                        <div className="text-xs text-muted-foreground text-center">
                          Filter: ₹{customPrice.min || "0"} - ₹{customPrice.max || "∞"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(category => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => toggleCategory(category)}
                      />
                    </Badge>
                  ))}
                  {selectedPriceRange !== null && (
                    <Badge variant="secondary" className="text-xs">
                      {priceRanges[selectedPriceRange].label}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => togglePriceRange(selectedPriceRange)}
                      />
                    </Badge>
                  )}
                  {useCustomPrice && customPrice.min && customPrice.max && (
                    <Badge variant="secondary" className="text-xs">
                      ₹{customPrice.min} - ₹{customPrice.max}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={toggleCustomPrice}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Sticky Footer */}
      <div className="border-t p-4 space-y-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {activeFilterCount > 0 
              ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`
              : 'No filters applied'
            }
          </span>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleApply}
            className="w-full h-11"
            size="lg"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full h-11"
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;