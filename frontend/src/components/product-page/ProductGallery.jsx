import React from "react";
import ImageSlider from "../../components/product/ImageSlider.jsx";

const ProductGallery = ({ images }) => {
  return (
    <div className="w-full lg:w-1/2">
      <ImageSlider images={images} />

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.slice(0, 5).map((img, idx) => (
            <div
              key={idx}
              className="w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors">
              <img
                src={img}
                alt={`View ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
