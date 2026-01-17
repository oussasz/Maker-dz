import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Local storage for recent searches
const RECENT_SEARCHES_KEY = "maker_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const getRecentSearches = () => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentSearch = (query) => {
  const recent = getRecentSearches();
  const filtered = recent.filter(
    (s) => s.toLowerCase() !== query.toLowerCase()
  );
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

const removeRecentSearch = (query) => {
  const recent = getRecentSearches();
  const updated = recent.filter((s) => s !== query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

const EnhancedSearch = ({
  className = "",
  onSearch,
  autoFocus = false,
  placeholder,
  showTrending = true,
}) => {
  const { t, i18n } = useTranslation("search");
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);

  // Trending searches (could be fetched from API)
  const trendingSearches = useMemo(
    () => [
      "Handmade jewelry",
      "Pottery",
      "Traditional crafts",
      "Leather bags",
      "Home decor",
    ],
    []
  );

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `/products/search/suggestions?q=${debouncedQuery}`
        );
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      const items =
        query.length >= 2
          ? suggestions
          : recentSearches.length > 0
            ? recentSearches
            : trendingSearches;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < items.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && items[selectedIndex]) {
            handleSearch(items[selectedIndex]);
          } else if (query.trim()) {
            handleSearch(query);
          }
          break;
        case "Escape":
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [query, suggestions, recentSearches, trendingSearches, selectedIndex]
  );

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    addRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
    setQuery(searchQuery);
    setIsOpen(false);

    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/search/searched/${searchQuery}`);
    }
  };

  const handleRemoveRecent = (e, searchItem) => {
    e.stopPropagation();
    removeRecentSearch(searchItem);
    setRecentSearches(getRecentSearches());
  };

  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const showDropdown =
    isOpen && (query.length >= 2 || recentSearches.length > 0 || showTrending);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div
        className={`
        relative flex items-center
        bg-gray-50 rounded-full
        border-2 transition-all duration-300
        ${
          isFocused
            ? "border-primary shadow-lg shadow-primary/10 bg-white"
            : "border-transparent hover:border-gray-200"
        }
      `}
      >
        <Search
          className={`
          absolute ${isRTL ? "right-4" : "left-4"} h-5 w-5 transition-colors
          ${isFocused ? "text-primary" : "text-gray-400"}
        `}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder || t("search_placeholder") || "Search products..."
          }
          autoFocus={autoFocus}
          className={`
            w-full bg-transparent py-3 text-base
            ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"}
            focus:outline-none placeholder:text-gray-400
          `}
          aria-label="Search products"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          role="combobox"
        />

        {/* Loading/Clear Button */}
        <div
          className={`absolute ${isRTL ? "left-4" : "right-4"} flex items-center gap-2`}
        >
          {isLoading && (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          )}
          {query && !isLoading && (
            <button
              onClick={clearQuery}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full left-0 right-0 mt-2
              bg-white rounded-2xl shadow-2xl border border-gray-100
              overflow-hidden z-50
            "
            role="listbox"
          >
            {/* Suggestions (when typing) */}
            {query.length >= 2 && suggestions.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-gray-400 px-3 py-2 font-medium">
                  Suggestions
                </p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      text-left transition-colors
                      ${
                        selectedIndex === index
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-50"
                      }
                    `}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 truncate">{suggestion}</span>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {query.length >= 2 && suggestions.length === 0 && !isLoading && (
              <div className="p-6 text-center">
                <p className="text-gray-500">
                  No suggestions found for "{query}"
                </p>
                <button
                  onClick={() => handleSearch(query)}
                  className="mt-3 text-primary font-medium hover:underline"
                >
                  Search for "{query}" →
                </button>
              </div>
            )}

            {/* Recent Searches */}
            {query.length < 2 && recentSearches.length > 0 && (
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs text-gray-400 px-3 py-2 font-medium flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </p>
                {recentSearches.map((search, index) => (
                  <div
                    key={search}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors group
                      ${
                        selectedIndex === index
                          ? "bg-primary/10"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    <Clock className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex-1 text-left truncate text-gray-700"
                    >
                      {search}
                    </button>
                    <button
                      onClick={(e) => handleRemoveRecent(e, search)}
                      className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all"
                      aria-label={`Remove ${search} from recent searches`}
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {query.length < 2 && showTrending && (
              <div className="p-2">
                <p className="text-xs text-gray-400 px-3 py-2 font-medium flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </p>
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="
                        px-3 py-1.5 bg-gray-100 rounded-full
                        text-sm text-gray-600
                        hover:bg-primary/10 hover:text-primary
                        transition-colors
                      "
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearch;
