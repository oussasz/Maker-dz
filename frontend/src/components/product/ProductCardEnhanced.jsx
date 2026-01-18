import React, { useState, memo } from "react";
import { IconButton, StarRating } from "../ui";
import { useNavigate } from "react-router-dom";
import { Eye, Heart, ShoppingCart, Check, Sparkles } from "lucide-react";
import { useProductModalStore } from "../../store/productModalStore";
import useWishlistStore from "../../store/wishlistStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton Loading Component
export const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
    <div className="w-full aspect-square bg-gray-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
      <div className="h-5 bg-gray-100 rounded animate-pulse w-1/2" />
      <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
    </div>
  </div>
);

const ProductCard = ({
  product,
  className = "",
  seller = false,
  index = 0,
}) => {
  const { openProductModal, setProduct } = useProductModalStore();
  const { addToWishlist, isInWishlist, removeFromWishlist } =
    useWishlistStore();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  // Support both MongoDB (_id) and MySQL (id)
  const productId = product.id || product._id;
  const productSlug = product.slug || productId;

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleRemoveFromWishlist = async () => {
    try {
      const res = await axiosPrivate.delete(`/wishlist?productId=${productId}`);
      if (res.status === 200) {
        removeFromWishlist(productId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const res = await axiosPrivate.post("/wishlist", { productId });
      if (res.status === 200) {
        addToWishlist(productId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWishlistAnimating(true);
    setTimeout(() => setWishlistAnimating(false), 300);

    if (inWishlist) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setProduct(product);
    openProductModal();
  };

  const handleCardClick = () => {
    if (seller) {
      navigate(`/dashboard/products/update/${productId}`);
    } else {
      navigate(`/products/${productSlug}`);
    }
  };

  // Calculate discount percentage if applicable
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.basePrice) / product.originalPrice) *
          100,
      )
    : 0;

  // Check stock status
  const isOutOfStock = product.totalStock === 0;
  const isLowStock = product.totalStock > 0 && product.totalStock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4 }}
      className={`
        ${className}
        group relative bg-white rounded-xl overflow-hidden
        border border-gray-100 
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/30
        cursor-pointer
        ${isOutOfStock ? "opacity-75" : ""}
      `}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${product.name} - DZD ${product.basePrice.toFixed(2)}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {/* Loading Skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}

        {/* Product Image */}
        <img
          src={product.mainImages[0]}
          alt={product.name}
          className={`
            w-full h-full object-cover
            transition-transform duration-500 ease-out
            ${isHovered ? "scale-110" : "scale-100"}
            ${isImageLoaded ? "opacity-100" : "opacity-0"}
          `}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Secondary Image on Hover */}
        {product.mainImages[1] && (
          <img
            src={product.mainImages[1]}
            alt={`${product.name} alternate view`}
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-300
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
            loading="lazy"
          />
        )}

        {/* Gradient Overlay on Hover */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-black/20 to-transparent
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              NEW
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              Only {product.totalStock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {!seller && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-3 right-3 flex flex-col gap-2"
              >
                {/* Wishlist Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  className={`
                    p-2.5 rounded-full shadow-lg backdrop-blur-sm
                    transition-all duration-200
                    ${
                      inWishlist
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
                    }
                    ${wishlistAnimating ? "scale-125" : ""}
                  `}
                  aria-label={
                    inWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-200 ${inWishlist ? "fill-current" : ""}`}
                  />
                </motion.button>

                {/* Quick View Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickView}
                  className="p-2.5 rounded-full bg-white/90 shadow-lg backdrop-blur-sm text-gray-600 hover:bg-primary hover:text-white transition-all duration-200"
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Quick Add to Cart - Bottom Bar */}
        {!seller && !isOutOfStock && (
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                  // Add to cart logic here
                }}
                className={`
                  absolute bottom-0 left-0 right-0
                  py-3 flex items-center justify-center gap-2
                  font-medium text-sm
                  transition-all duration-200
                  ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  }
                `}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Quick Add
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.categories?.[0]?.name && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {product.categories[0].name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors duration-200 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <StarRating
            rating={product.averageRating || 0}
            className="scale-90 origin-left"
          />
          {product.reviewCount > 0 && (
            <span className="text-xs text-gray-400">
              ({product.reviewCount})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg font-bold text-gray-900">
            DZD {product.basePrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              DZD {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Seller Badge (if applicable) */}
        {product.sellerName && !seller && (
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {product.sellerName}
          </p>
        )}
      </div>

      {/* Seller Mode Indicator */}
      {seller && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white text-xs py-2 text-center font-medium">
          Click to Edit
        </div>
      )}
    </motion.div>
  );
};

export default memo(ProductCard);
