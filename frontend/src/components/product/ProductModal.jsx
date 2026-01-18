import React from "react";

import { Divider, IconButton, Modal, StarRating } from "../ui";
import { Facebook, Instagram, Twitter } from "lucide-react";

import ImageSlider from "./ImageSlider";
import { useProductModalStore } from "../../store/productModalStore";
import Button from "../ui/my-button";
import { useNavigate } from "react-router-dom";

const ProductModal = () => {
  const { isOpen, closeProductModal, product, resetProduct } =
    useProductModalStore();
  const navigate = useNavigate();

  if (!product) return null;

  const images = product.mainImages;
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        closeProductModal();
        resetProduct();
      }}
    >
      <section className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl 2xl:min-w-7xl">
        <div className="w-full lg:w-1/2">
          <ImageSlider images={images} />
        </div>

        <div className="w-full lg:w-1/2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {product.name}
            </h1>
            <div className="text-sm rounded-sm text-primary px-2 py-1 bg-primary/10 w-fit">
              In Stock
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:items-center gap-4 sm:gap-7 mb-5">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <StarRating rating={product.averageRating} maxRating={5} />
              </div>
              <p className="text-sm text-gray-500">
                {product.totalReviews} Reviews
              </p>
            </div>

            <div className="text-sm text-gray-700 font-medium">
              SKU:{" "}
              <span className="text-gray-500 font-normal">
                {product.id || product._id}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div className="gap-1 flex items-center">
              <span className={` text-lg sm:text-xl text-gray-900`}>
                ${product.basePrice}
              </span>
            </div>
          </div>

          <Divider />

          <div className="w-full my-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Share Item: </span>
                <IconButton icon={<Facebook />} />
                <IconButton icon={<Twitter />} />
                <IconButton icon={<Instagram />} />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">{product.description}</p>
          </div>

          <Divider />

          <div className="py-4 ">
            <Button
              grow
              onClick={() => {
                navigate(
                  `/products/${product.slug || product.id || product._id}`,
                );
                closeProductModal();
              }}
            >
              See Details
            </Button>
          </div>

          <Divider />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6 mb-3">
            <div className="text-sm font-medium">Categories:</div>
            <div className="text-sm text-gray-500">
              {product.categories.map((cat) => cat.name).join(", ")}
            </div>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default ProductModal;
