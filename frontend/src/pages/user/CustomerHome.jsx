import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import useAuth from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import ProductCard from "../../components/product/ProductCardEnhanced";
import LoadingSpinner from "../../components/ui/loading-spinner";
import {
  Search,
  ShoppingBag,
  Heart,
  Package,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Grid3X3,
  ChevronRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

// ============================================
// WELCOME BANNER
// ============================================
const WelcomeBanner = ({ userName }) => {
  const { t } = useTranslation("customer");
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting_morning", "Good morning");
    if (hour < 18) return t("greeting_afternoon", "Good afternoon");
    return t("greeting_evening", "Good evening");
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-amber-400 text-sm font-medium mb-1">
              {getGreeting()}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              {t("welcome_back", "Welcome back")},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {userName || t("shopper", "Shopper")}
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              {t(
                "discover_subtitle",
                "Discover unique handcrafted treasures from Algeria",
              )}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <Link
              to="/cart"
              className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-colors"
            >
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cart?.items?.length || 0}</p>
                <p className="text-xs text-gray-400">
                  {t("in_cart", "In Cart")}
                </p>
              </div>
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-colors"
            >
              <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{wishlist?.length || 0}</p>
                <p className="text-xs text-gray-400">{t("saved", "Saved")}</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// SEARCH BAR
// ============================================
const SearchBar = ({ onSearch }) => {
  const { t } = useTranslation("customer");
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="max-w-2xl mx-auto -mt-7 relative z-10 px-4"
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "search_placeholder",
              "Search for handcrafted products...",
            )}
            className="w-full pl-14 pr-32 py-4 h-14 text-lg border-0 rounded-2xl shadow-xl bg-white focus:ring-2 focus:ring-amber-500/30"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-6"
          >
            {t("search", "Search")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

// ============================================
// QUICK CATEGORIES
// ============================================
const QuickCategories = ({ categories }) => {
  const { t } = useTranslation("customer");

  const categoryColors = [
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-violet-600",
    "from-slate-600 to-gray-700",
  ];

  if (!categories?.length) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {t("shop_by_category", "Shop by Category")}
          </h2>
          <Link
            to="/categories"
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm"
          >
            {t("view_all", "View All")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/products/categories/${category.name}`}
                className="group block"
              >
                <div
                  className={`relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br ${categoryColors[index % categoryColors.length]}`}
                >
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <p className="text-white font-semibold text-center text-sm leading-tight">
                      {category.name}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FEATURED PRODUCTS SECTION
// ============================================
const FeaturedProducts = ({ products, title, icon: Icon, link, linkText }) => {
  const { t } = useTranslation("customer");

  if (!products?.length) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          {link && (
            <Link
              to={link}
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm"
            >
              {linkText || t("view_all", "View All")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// PROMOTIONAL BANNER
// ============================================
const PromoBanner = () => {
  const { t } = useTranslation("customer");

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 md:p-12"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <pattern
                id="promo-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="8" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#promo-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <p className="text-amber-100 text-sm font-medium mb-2">
                {t("promo_badge", "✨ Limited Time Offer")}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {t("promo_title", "Authentic Algerian Crafts")}
              </h3>
              <p className="text-white/80">
                {t(
                  "promo_subtitle",
                  "Support local artisans and discover unique handmade treasures",
                )}
              </p>
            </div>
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 rounded-full shadow-lg"
              >
                {t("shop_now", "Shop Now")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// TRUST BADGES
// ============================================
const TrustBadges = () => {
  const { t } = useTranslation("customer");

  const badges = [
    {
      icon: Truck,
      title: t("badge_shipping", "Fast Shipping"),
      description: t("badge_shipping_desc", "Nationwide delivery"),
    },
    {
      icon: Shield,
      title: t("badge_secure", "Secure Payments"),
      description: t("badge_secure_desc", "100% protected"),
    },
    {
      icon: RefreshCw,
      title: t("badge_returns", "Easy Returns"),
      description: t("badge_returns_desc", "30-day guarantee"),
    },
    {
      icon: Star,
      title: t("badge_quality", "Quality Assured"),
      description: t("badge_quality_desc", "Handpicked artisans"),
    },
  ];

  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto mb-3 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <badge.icon className="w-7 h-7 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {badge.title}
              </h4>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// MAIN CUSTOMER HOME
// ============================================
const CustomerHome = () => {
  const { t } = useTranslation("customer");
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/categories"),
        ]);

        setProducts(productsRes.data.products || productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    window.location.href = `/search/searched/${encodeURIComponent(query)}`;
  };

  // Sort products for different sections
  const trendingProducts = [...products]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 10);

  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  if (loading) {
    return <LoadingSpinner text={t("loading", "Loading...")} />;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Welcome Banner */}
      <WelcomeBanner userName={user?.name?.split(" ")[0]} />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Quick Categories */}
      <QuickCategories categories={categories} />

      {/* Trending Products */}
      <FeaturedProducts
        products={trendingProducts}
        title={t("trending_now", "Trending Now")}
        icon={TrendingUp}
        link="/products"
        linkText={t("explore_all", "Explore All")}
      />

      {/* Promo Banner */}
      <PromoBanner />

      {/* New Arrivals */}
      <FeaturedProducts
        products={newArrivals}
        title={t("new_arrivals", "New Arrivals")}
        icon={Sparkles}
        link="/new-arrivals"
        linkText={t("see_new", "See What's New")}
      />

      {/* Trust Badges */}
      <TrustBadges />
    </main>
  );
};

export default CustomerHome;
