import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GridContainer } from "../../components/ui";
import ProductCard from "../../components/product/ProductCard";
import { Heart } from "lucide-react";
import { Button } from "../../components/ui/button";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import LoadingSpinner from "../../components/ui/loading-spinner.jsx";

const Wishlist = () => {
  const { t } = useTranslation("wishlist");
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("/wishlist");
      setWishlistProducts(res.data.wishlist);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  console.log("products: ", wishlistProducts);

  return loading ? (
    <LoadingSpinner />
  ) : wishlistProducts.length > 0 ? (
    <div className="w-full bg-background min-h-screen p-6">
      {/* Header */}
      <div className="my-12 text-center space-y-3">
        <h1 className="font-bold text-4xl tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">
          {t("items_saved", { count: wishlistProducts.length })}
        </p>
      </div>

      {/* Product grid */}
      <div className="animate-fadeIn">
        <GridContainer cols={4} gap={6}>
          {wishlistProducts.map((prod) => (
            <ProductCard product={prod} key={prod._id} />
          ))}
        </GridContainer>
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col items-center justify-center gap-6 h-[90vh] text-center animate-fadeIn">
      <div className="relative">
        <Heart size={180} color="#d9d9d9" fill="#f5f5f5" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart
            size={100}
            color="#ef4444"
            className="opacity-20 animate-pulse"
          />
        </div>
      </div>

      <h1 className="text-3xl font-semibold">{t("empty_title")}</h1>
      <p className="text-muted-foreground max-w-md">{t("empty_message")}</p>

      <Link to="/">
        <Button size="lg" className="mt-2 rounded-xl">
          {t("browse_products")}
        </Button>
      </Link>
    </div>
  );
};

export default Wishlist;
