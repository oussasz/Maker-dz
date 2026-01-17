import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

const ImageSlider = ({
  images = [
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606914469633-0fb71672d6b4?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1594736797933-d0f7b7a8b5e4?w=600&h=600&fit=crop",
  ],
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const goToPrevious = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-4">
        {/* Thumbnail Column */}
        <div className="flex flex-col items-center gap-3 w-20 lg:w-24">
          <ChevronUp
            onClick={goToPrevious}
            className={`cursor-pointer w-6 h-6 transition-colors ${
              selectedImage === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800"
            }`}
          />

          <div className="flex flex-col gap-2 w-full max-h-96 overflow-y-auto">
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary "
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
          </div>

          <ChevronDown
            onClick={goToNext}
            className={`cursor-pointer w-6 h-6 transition-colors ${
              selectedImage === images.length - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800"
            }`}
          />
        </div>

        {/* Main Image */}
        <div className="flex-1 max-w-2xl">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={`Main view ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Main Image with Navigation */}
        <div className="relative aspect-square rounded-lg overflow-hidden  mb-4">
          <img
            src={images[selectedImage]}
            alt={`Main view ${selectedImage + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            disabled={selectedImage === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm  transition-all ${
              selectedImage === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/90 active:scale-95"
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={goToNext}
            disabled={selectedImage === images.length - 1}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm  transition-all ${
              selectedImage === images.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/90 active:scale-95"
            }`}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        </div>

        {/* Mobile Thumbnail Row */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index ? "border-primary " : "border-gray-200"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
