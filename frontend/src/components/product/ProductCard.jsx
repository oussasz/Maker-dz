import React from "react";
import { IconButton, StarRating } from "../ui";
import { useNavigate } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { useProductModalStore } from "../../store/productModalStore";
import useWishlistStore from "../../store/wishlistStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../store/authStore";
import { toast } from "sonner";

const ProductCard = ({ product, className = "", seller = false }) => {
  const { openProductModal, setProduct } = useProductModalStore();
  const { addToWishlist, isInWishlist, removeFromWishlist } =
    useWishlistStore();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();
  const productId = product._id;

  const handleRemoveFromWishlist = async () => {
    try {
      const res = await axiosPrivate.delete(
        `/wishlist/remove?productId=${productId}`
      );

      if (res.status === 200) {
        removeFromWishlist(productId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const res = await axiosPrivate.post("/wishlist/add", {
        productId,
      });

      if (res.status === 200) {
        addToWishlist(productId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    // Check authentication before wishlist action
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist(productId)) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  return (
    <div
      className={`${className} group border bg-white border-gray-200 transition-all duration-200 hover:z-10 hover:border-primary hover:shadow-hover-primary cursor-pointer`}
      onClick={() =>
        seller
          ? navigate(`/dashboard/products/update/${productId}`)
          : navigate(`/products/${productId}`)
      }
    >
      <div className="w-full h-48 sm:h-60 relative overflow-hidden">
        <div className="absolute top-2 right-2  sm:right-4 flex items-center gap-1 sm:gap-2 flex-col transition-all duration-200 opacity-0 invisible translate-y-6 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 mt-1 sm:mt-2 z-10">
          {!seller && (
            <IconButton
              classes={"bg-white"}
              icon={
                isInWishlist(productId) ? (
                  <Heart className="sm:h-5 sm:w-5 h-4 w-4 fill-red-500 stroke-red-500" />
                ) : (
                  <Heart className="sm:h-5 sm:w-5 h-3 w-3" />
                )
              }
              className="text-xs sm:text-base"
              onClick={handleWishlist}
            />
          )}

          <IconButton
            classes={"bg-white"}
            icon={<Eye className="sm:h-5 sm:w-5 h-3 w-3" />}
            className="text-xs sm:text-base"
            onClick={(e) => {
              e.stopPropagation();
              setProduct(product);
              openProductModal();
            }}
          />
        </div>
        <img
          src={product.mainImages[0]}
          alt={product.name}
          className="w-full h-full object-cover aspect-square"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:pt-3 sm:pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xs sm:text-sm font-normal text-gray-500 group-hover:text-primary transition-all duration-200 truncate">
            {product.name}
          </h1>

          <div className="font-medium flex gap-1 text-sm sm:text-base">
            DZD {product.basePrice.toFixed(2)}{" "}
          </div>

          <StarRating rating={product.averageRating} className="mt-1" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
