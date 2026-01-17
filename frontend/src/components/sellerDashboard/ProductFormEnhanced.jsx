import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import useProductForm from "../../hooks/product/useProductForm";
import {
  Upload,
  X,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Tag,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useState } from "react";

export default function ProductFormEnhanced({ data, setData }) {
  const { t } = useTranslation("seller_addproduct");
  const [isDragging, setIsDragging] = useState(false);

  const {
    mainImagesPreview,
    mainImageInputRef,
    handleFieldChange,
    handleMainImageUpload,
    removeMainImage,
  } = useProductForm(data, setData);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleMainImageUpload(files);
    }
  };

  return (
    <div className="space-y-8">
      {/* Product Name */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Tag size={16} className="text-primary" />
          {t("name")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            value={data.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder={t("product_name_placeholder")}
            className="h-12 text-lg border-gray-200 focus:border-primary focus:ring-primary/20 pl-4 pr-12"
          />
          {data.name && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Sparkles size={18} className="text-green-500" />
            </motion.div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Choose a clear, descriptive name for your handcrafted item
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FileText size={16} className="text-primary" />
          {t("description")}
        </Label>
        <Textarea
          value={data.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder={t("describe_product_placeholder")}
          className="min-h-[150px] border-gray-200 focus:border-primary focus:ring-primary/20 resize-none"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Tell the story behind your craft - materials, process, inspiration
          </span>
          <span
            className={data.description?.length > 500 ? "text-amber-600" : ""}
          >
            {data.description?.length || 0} characters
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <DollarSign size={16} className="text-primary" />
          {t("price")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative max-w-xs">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={data.basePrice}
            onChange={(e) => handleFieldChange("basePrice", e.target.value)}
            placeholder="0.00"
            className="h-12 text-xl font-semibold border-gray-200 focus:border-primary focus:ring-primary/20 pl-4 pr-16"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            DZD
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Set a fair price that reflects your craftsmanship and materials
        </p>
      </div>

      {/* Images Upload */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <ImageIcon size={16} className="text-primary" />
          {t("main_product_images")}
        </Label>

        <input
          type="file"
          multiple
          accept="image/*"
          ref={mainImageInputRef}
          hidden
          onChange={(e) => handleMainImageUpload(e.target.files)}
        />

        {/* Upload Area */}
        <motion.div
          onClick={() => mainImageInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className={`p-4 rounded-full ${isDragging ? "bg-primary/10" : "bg-gray-100"}`}
              animate={{ y: isDragging ? -5 : 0 }}
            >
              <Upload
                size={28}
                className={isDragging ? "text-primary" : "text-gray-400"}
              />
            </motion.div>
            <div>
              <p className="font-medium text-gray-700">
                {isDragging ? "Drop images here" : t("click_to_upload")}
              </p>
              <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-400">{t("upload_limit")}</p>
          </div>

          {/* Progress indicator when images exist */}
          {mainImagesPreview?.length > 0 && (
            <div className="absolute bottom-3 right-3 bg-white rounded-full px-3 py-1 shadow-md">
              <span
                className={`text-sm font-medium ${
                  mainImagesPreview.length >= 5
                    ? "text-amber-600"
                    : "text-gray-600"
                }`}
              >
                {mainImagesPreview.length}/5 images
              </span>
            </div>
          )}
        </motion.div>

        {/* Image Previews */}
        <AnimatePresence>
          {mainImagesPreview?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-gray-600">
                Uploaded Images ({mainImagesPreview.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {mainImagesPreview?.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group aspect-square"
                  >
                    <img
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl border-2 border-gray-200 group-hover:border-primary/50 transition-colors"
                    />

                    {/* Main Image Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        MAIN
                      </div>
                    )}

                    {/* Remove Button */}
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMainImage(index);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </motion.button>

                    {/* Drag Handle */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-md p-1 shadow-sm">
                        <GripVertical size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {mainImagesPreview.length >= 5 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg"
                >
                  <Sparkles size={14} />
                  Maximum 5 images reached. Remove an image to add more.
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
