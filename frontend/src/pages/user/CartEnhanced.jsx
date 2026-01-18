import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import useCartStore from "../../store/cartStore.js";
import {
  ShoppingCart,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Tag,
  Truck,
  Shield,
  ChevronRight,
  Package,
  Sparkles,
} from "lucide-react";
import useCart from "../../hooks/cart/useCart.js";
import useCartActions from "../../hooks/cart/useCartActions.js";
import { toast } from "sonner";

// Progress indicator for cart
const CartProgress = ({ currentAmount, freeShippingThreshold = 5000 }) => {
  const { t } = useTranslation("cart");
  const progress = Math.min((currentAmount / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - currentAmount, 0);

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-gray-700">
            {remaining > 0
              ? t("add_for_free_shipping", { amount: remaining.toFixed(0) })
              : t("free_shipping_unlocked")}
          </span>
        </div>
        <span className="text-xs text-gray-500">{progress.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${
            progress >= 100
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-primary to-accent"
          }`}
        />
      </div>
    </div>
  );
};

// Enhanced Cart Item Component
const CartItemCard = ({ item, actions, index }) => {
  // Support both old MongoDB structure (productId as object) and new MySQL structure (product as object)
  const product = item.product || item.productId || {};
  const variant =
    item.variant ||
    product.variants?.find((v) => (v.id || v._id) === item.variantId);
  const productId = product.id || product._id || item.productId;
  const productSlug = product.slug || productId;
  const productImages = product.mainImages || [];
  const variantAttributes = variant?.attributes || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4 md:gap-6">
        {/* Product Image */}
        <Link
          to={`/products/${productSlug}`}
          className="relative w-24 md:w-32 aspect-square rounded-xl overflow-hidden flex-shrink-0"
        >
          <img
            src={productImages[0] || "/placeholder.png"}
            alt={product.name || "Product"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {variant && Object.keys(variantAttributes).length > 0 && (
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
              {Object.values(variantAttributes)[0]}
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/products/${productSlug}`}
                className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2"
              >
                {product.name || "Unknown Product"}
              </Link>

              {/* Variant Info */}
              {variant && Object.keys(variantAttributes).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(variantAttributes).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      <span className="capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Personalization */}
              {item.personalization && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  "{item.personalization}"
                </p>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={() => actions.handleItemRemove(item)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Price & Quantity */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => actions.handleDecrement(item)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() => actions.handleIncrement(item)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                DZD {(item.price * item.quantity).toFixed(2)}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-gray-400">
                  DZD {item.price.toFixed(2)} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Order Summary Component
const OrderSummary = ({ cart, onCheckout }) => {
  const { t } = useTranslation("cart");

  // Calculate subtotal dynamically from items (handles both API formats)
  const calculatedSubtotal = (cart.items || []).reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0) * (item.quantity || 1);
  }, 0);

  // Use calculated subtotal, or fall back to totalAmount/total_amount from API
  const subtotal =
    calculatedSubtotal ||
    parseFloat(cart.totalAmount) ||
    parseFloat(cart.total_amount) ||
    0;
  const shipping = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {t("order_summary")}
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>{t("subtotal", { count: cart.items?.length || 0 })}</span>
          <span>DZD {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            {t("shipping")}
          </span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? t("free") : `DZD ${shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Promo Code */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("promo_code")}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <Button variant="outline" size="sm">
              {t("apply")}
            </Button>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {t("total")}
            </span>
            <span className="text-2xl font-bold text-primary">
              DZD {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          className="w-full py-6 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 group"
        >
          {t("proceed_to_checkout")}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-4 text-gray-400">
          <div className="flex items-center gap-1 text-xs">
            <Shield className="h-4 w-4" />
            {t("secure")}
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1 text-xs">
            <Package className="h-4 w-4" />
            {t("fast_delivery")}
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  const { t } = useTranslation("cart");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center justify-center gap-6 min-h-[60vh] text-center px-4"
    >
      <div className="relative">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShoppingCart className="h-32 w-32 text-gray-200" strokeWidth={1} />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full"
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("empty_cart_title")}
        </h1>
        <p className="text-gray-500 max-w-md">{t("empty_cart_message")}</p>
      </div>

      <Link to="/">
        <Button
          size="lg"
          className="rounded-xl shadow-lg shadow-primary/20 group px-8"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          {t("start_shopping")}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>

      {/* Suggestions */}
      <div className="mt-8 pt-8 border-t border-gray-100 w-full max-w-md">
        <p className="text-sm text-gray-400 mb-4">{t("popular_categories")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Jewelry", "Pottery", "Leather", "Home Decor", "Art"].map((cat) => (
            <Link
              key={cat}
              to={`/products/categories/${cat}`}
              className="px-4 py-2 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-full text-sm transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Main Cart Component
const Cart = () => {
  const { t } = useTranslation("cart");
  const { cart } = useCartStore();
  const navigate = useNavigate();

  useCart();
  const {
    handleDecrement,
    handleIncrement,
    handleVariantChange,
    handleItemRemove,
    handlePersonalizationChange,
  } = useCartActions();

  const cartItems = cart?.items || [];
  
  console.log("CartEnhanced render - cart:", cart);
  console.log("CartEnhanced render - cartItems:", cartItems);
  console.log("CartEnhanced render - cartItems length:", cartItems.length);

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("shopping_cart")}
            </h1>
            <p className="text-gray-500 mt-1">
              {t("items_in_cart", { count: cartItems.length })}
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {t("continue_shopping")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Progress */}
        <CartProgress currentAmount={cart.totalAmount || 0} />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <CartItemCard
                  key={item._id}
                  item={item}
                  index={index}
                  actions={{
                    handleDecrement,
                    handleIncrement,
                    handleItemRemove,
                    handleVariantChange,
                    handlePersonalizationChange,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <OrderSummary
              cart={cart}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
