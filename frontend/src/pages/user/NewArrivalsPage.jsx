import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Package,
  Grid,
  List,
  Heart,
} from "lucide-react";
import axios from "../../api/axios";
import { Button } from "../../components/ui/button";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    items: wishlistItems,
  } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get("/products", {
          params: {
            sort: "newest",
            limit: 20,
          },
        });
        setProducts(response.data?.products || []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const toggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Fresh from Our Artisans
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              New Arrivals
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the latest handcrafted treasures added to our marketplace
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              {products.length} new product{products.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : products.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/products/${product._id}`}>
                    {viewMode === "grid" ? (
                      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={
                              product.images?.[0] || "/placeholder-product.jpg"
                            }
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                            New
                          </span>
                          <button
                            onClick={(e) => toggleWishlist(e, product)}
                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isInWishlist(product._id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                            {product.category}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {product.price?.toLocaleString()} DZD
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all p-4">
                        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={
                              product.images?.[0] || "/placeholder-product.jpg"
                            }
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                            New
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {product.category}
                          </p>
                          <p className="text-lg font-bold text-primary mb-2">
                            {product.price?.toLocaleString()} DZD
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => toggleWishlist(e, product)}
                          className="p-2 h-fit rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isInWishlist(product._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                New Products Coming Soon
              </h3>
              <p className="text-gray-500 mb-6">
                Our artisans are crafting new items. Check back soon!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Looking for more?
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our full collection of authentic handcrafted items
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NewArrivalsPage;
