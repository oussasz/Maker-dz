import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Counter,
  Divider,
  GridContainer,
  IconButton,
  StarRating,
} from "../../components/ui";
import {
  Facebook,
  Heart,
  Instagram,
  ShoppingCart,
  Twitter,
} from "lucide-react";
import Button from "../../components/ui/my-button.jsx";
import HomeSection from "../../components/sections/HomeSection";
import ProductCard from "../../components/product/ProductCardEnhanced";
import LoadingSpinner from "../../components/ui/loading-spinner";

// New Imports
import useProduct from "../../hooks/product/useProduct";
import useProductVariant from "../../hooks/product/useProductVariant";
import useRelatedProducts from "../../hooks/product/useRelatedProducts";
import useProductActions from "../../hooks/product/useProductActions";
import ProductGallery from "../../components/product-page/ProductGallery";
import VariantSelector from "../../components/product-page/VariantSelector";
import { Textarea } from "../../components/ui/textarea.js";
import BuyNowModal from "../../components/BuyNowModal.jsx";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar.tsx";

const ProductPage = () => {
  const { productId } = useParams();
  const { t } = useTranslation("product");
  const [personalization, setPersonalization] = useState("");

  // State
  const [quantity, setQuantity] = useState(1);

  // Hooks
  const { product, rating, isLoading } = useProduct(productId);
  const { selectedVariant, selectedAttributes, handleAttributeChange } =
    useProductVariant(product);
  const { relatedProducts } = useRelatedProducts(product);

  // Computed Values (needed for actions)
  const currentPrice = selectedVariant?.price || product?.basePrice || 0;

  const {
    buyNowOpen,
    setBuyNowOpen,
    handleWishlist,
    handleAddToCart,
    handleBuyNow,
    isInWishlist,
  } = useProductActions(
    product,
    selectedVariant,
    selectedAttributes,
    currentPrice,
    personalization,
    quantity,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Computed Values for UI
  const currentImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product?.mainImages || [];
  const currentStock = selectedVariant?.quantity || 0;

  const currentSku = productId || "N/A";

  const sellerDisplayName = product?.seller
    ? product.seller.shopName ||
      [product.seller.firstName, product.seller.lastName]
        .filter(Boolean)
        .join(" ") ||
      product.seller.username
    : "";

  const sellerInitials = sellerDisplayName
    ? sellerDisplayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "S";

  if (isLoading || !product) return <LoadingSpinner />;

  return (
    <div className="w-full flex justify-center items-start py-6">
      <main>
        <section className="flex flex-col lg:flex-row gap-6 w-full ">
          {/* LEFT: Images */}
          <ProductGallery images={currentImages} />

          {/* RIGHT: Product Info */}
          <div className="w-full lg:w-1/2 p-4">
            {/* Name + Wishlist */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <h1 className="text-2xl sm:text-3xl font-semibold">
                  {product.name}
                </h1>
                <span
                  className={`text-sm rounded-sm px-2 py-1 ${
                    currentStock > 0
                      ? "text-primary bg-primary/10"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {currentStock > 0
                    ? t("in_stock", { count: currentStock })
                    : t("out_of_stock")}
                </span>
              </div>
              <IconButton
                onClick={handleWishlist}
                icon={
                  isInWishlist ? (
                    <Heart className="h-5 w-5 fill-red-500 stroke-red-500" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )
                }
              />
            </div>

            {/* Rating + SKU */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 mb-5">
              <div className="flex items-center gap-1.5">
                <StarRating rating={rating.average} maxRating={5} />
                <p className="text-sm text-gray-500">
                  {rating.count} {t("reviews")}
                </p>
              </div>
              <div className="text-sm text-gray-700">
                {t("sku")}: <span className="text-gray-500">{currentSku}</span>
              </div>
            </div>

            {/* Seller Info */}
            {product?.seller && (
              <div className="flex items-center gap-3 mb-5 p-3 rounded-lg border bg-gray-50">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={product.seller.shopLogo || ""}
                    alt={sellerDisplayName}
                  />
                  <AvatarFallback>{sellerInitials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{t("seller")}</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {sellerDisplayName}
                  </p>
                  {product.seller.shopDescription && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {product.seller.shopDescription}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${currentPrice.toFixed(2)}
                </span>
                {selectedVariant &&
                  selectedVariant.price !== product.basePrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  )}
              </div>
              {product.totalSold > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {product.totalSold} sold
                </p>
              )}
            </div>

            <Divider />

            {/* VARIANT SELECTOR */}
            <VariantSelector
              product={product}
              selectedAttributes={selectedAttributes}
              handleAttributeChange={handleAttributeChange}
            />

            <div className="mb-6 mt-4">
              <label className="text-sm font-medium capitalize">
                {t("personalization")}:
              </label>
              <Textarea
                value={personalization}
                onChange={(e) => setPersonalization(e.currentTarget.value)}
                maxLength={254}
                placeholder={t("personalization_placeholder")}
              />
            </div>
            {selectedVariant && (
              <>
                <Divider />
                <div className="text-sm text-gray-600 py-2">
                  <span className="font-medium">{t("selected")}: </span>
                  {Object.entries(selectedAttributes).map(
                    ([key, value], idx) => (
                      <span key={key}>
                        {idx > 0 && ", "}
                        {key}: {value}
                      </span>
                    ),
                  )}
                </div>
              </>
            )}

            <Divider />

            {/* Action Buttons */}
            <div className="flex items-center py-4 gap-3">
              <Counter count={quantity} setCount={setQuantity} />
              <Button
                className="flex-1"
                onClick={async () => {
                  await handleAddToCart(quantity);
                }}
              >
                {t("add_to_cart")}
              </Button>
              <Button
                variant="outlined"
                className="flex-1"
                onClick={() => setBuyNowOpen(true)}
              >
                {t("buy_now")}
              </Button>
            </div>

            <Divider />
            {/* Description */}
            <div className="w-full my-6">
              <h3 className="text-lg font-semibold mb-3">{t("description")}</h3>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <>
                  <Divider />
                  <div className="my-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {t("specifications")}
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex text-sm">
                            <span className="font-medium text-gray-700 w-40 capitalize">
                              {key}:
                            </span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </>
              )}

            <Divider />

            {/* Categories & Tags */}
            <div className="space-y-3 my-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">{t("categories")}:</span>
                <span className="text-sm text-gray-500">
                  {product.categories.map((cat) => cat.name).join(", ")}
                </span>
              </div>

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium">{t("tags")}:</span>
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Divider />

            {/* Social Sharing */}
            <div className="flex items-center gap-2 mt-6">
              <span className="text-sm">{t("share_item")}:</span>
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <IconButton key={i} icon={<Icon />} />
              ))}
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="max-w-7xl 2xl:min-w-7xl w-full p-4">
            <HomeSection
              title={t("related")}
              subtitle={t("people_also_like")}
              viewAll={false}
            >
              <GridContainer cols={4} gap={5}>
                {relatedProducts.map((prod) => (
                  <ProductCard product={prod} key={prod.id || prod._id} />
                ))}
              </GridContainer>
            </HomeSection>
          </section>
        )}

        {/* Buy Now Modal */}
        <BuyNowModal
          open={buyNowOpen}
          onClose={() => setBuyNowOpen(false)}
          onSubmit={handleBuyNow}
        />
      </main>
    </div>
  );
};

export default ProductPage;
