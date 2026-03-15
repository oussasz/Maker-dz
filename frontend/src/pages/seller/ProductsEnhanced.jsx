import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import ProductCard from "../../components/product/ProductCardEnhanced";
import GridContainer from "../../components/ui/grid-container.jsx";
import { Input } from "../../components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Button } from "../../components/ui/button.tsx";
import LoadingSpinner from "../../components/ui/loading-spinner";
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Package,
  Grid3X3,
  List,
  ArrowUpDown,
  TrendingUp,
  Eye,
  DollarSign,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import useAuth from "../../store/authStore.js";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced product card for seller view
const SellerProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation("seller_products");

  const mainImage =
    product.mainImages?.[0] || product.images?.[0] || "/placeholder.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <motion.img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Quick Actions */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-2">
              <Link
                to={`/dashboard/products/update/${product.slug || product.id}`}
                className="flex-1"
              >
                <Button size="sm" variant="secondary" className="w-full gap-2">
                  Edit
                </Button>
              </Link>
              <Link to={`/products/${product.slug || product.id}`}>
                <Button size="sm" variant="secondary" className="gap-2">
                  <Eye size={14} />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Status Badge */}
          {product.status && (
            <div className="absolute top-3 left-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {product.status === "active" ? "Active" : "Draft"}
              </span>
            </div>
          )}

          {/* Stock Warning */}
          {product.stock !== undefined && product.stock < 5 && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Low Stock: {product.stock}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
              {product.name}
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={16} className="text-gray-400" />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {product.basePrice?.toLocaleString()} DZD
            </span>
            {product.originalPrice &&
              product.originalPrice > product.basePrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice?.toLocaleString()} DZD
                </span>
              )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Eye size={14} />
              <span>{product.views || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <TrendingUp size={14} />
              <span>{product.sales || 0} sold</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProductsEnhanced = () => {
  const { user } = useAuth();
  const { t } = useTranslation("seller_products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const sellerId = user.id;
      const response = await axios.get(`/sellers/${sellerId}/products`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const [key, direction] = sortBy.split("-");

    filtered.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (key === "basePrice") {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }

      if (key === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, sortBy]);

  // Stats
  const totalValue = products.reduce((sum, p) => sum + (p.basePrice || 0), 0);
  const activeProducts = products.filter(
    (p) => p.status === "active" || !p.status,
  ).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text={t("loading_products")} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
            {t("product_management")}
            <Sparkles className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-gray-500 mt-1 hidden lg:block">
            Manage your handcrafted products and inventory
          </p>
        </div>

        <Link to="/dashboard/products/add">
          <Button className="gap-2 shadow-lg shadow-primary/25">
            <PlusCircle size={18} />
            Add New Product
          </Button>
        </Link>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeProducts}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <DollarSign size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-bold text-gray-900">
                {totalValue.toLocaleString()} DZD
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100">
              <Eye size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + (p.views || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder={t("search_products_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] h-11 border-gray-200">
            <ArrowUpDown size={14} className="mr-2 text-gray-400" />
            <SelectValue placeholder={t("sort_by_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">{t("name_asc")}</SelectItem>
            <SelectItem value="name-desc">{t("name_desc")}</SelectItem>
            <SelectItem value="basePrice-asc">{t("price_asc")}</SelectItem>
            <SelectItem value="basePrice-desc">{t("price_desc")}</SelectItem>
            <SelectItem value="createdAt-desc">{t("newest")}</SelectItem>
            <SelectItem value="createdAt-asc">{t("oldest")}</SelectItem>
          </SelectContent>
        </Select>

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
      </motion.div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {filteredAndSortedProducts.length > 0 ? (
          <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredAndSortedProducts.map((product, index) => (
              <SellerProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No products found" : "No products yet"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm
                ? `No products match "${searchTerm}". Try a different search term.`
                : "Start by adding your first handcrafted product to your shop."}
            </p>
            {!searchTerm && (
              <Link to="/dashboard/products/add">
                <Button className="gap-2">
                  <PlusCircle size={18} />
                  Add Your First Product
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsEnhanced;
