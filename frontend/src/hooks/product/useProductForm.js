import { useState, useRef } from "react";

export default function useProductForm(initialData, setData) {
  const [mainImagesPreview, setMainImagesPreview] = useState(
    initialData.images || []
  );

  const mainImageInputRef = useRef(null);

  const handleFieldChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const newFileObjects = Array.from(files);

    // Combine previous + new and keep last 5 files
    const combinedFiles = [...initialData.images, ...newFileObjects];
    const imageFiles = combinedFiles.slice(-5); // FOR BACKEND

    // Generate previews only for newly added
    const newPreviews = newFileObjects
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));

    // Combine previews and keep last 5
    const combinedPreviews = [...mainImagesPreview, ...newPreviews].slice(-5);

    setMainImagesPreview(combinedPreviews);
    setData((prev) => ({ ...prev, images: imageFiles }));
  };

  const removeMainImage = (index) => {
    // Remove from file list stored in data
    const newFiles = [...initialData.images];
    newFiles.splice(index, 1);

    setData((prev) => ({ ...prev, images: newFiles }));

    // Revoke the preview object URL
    URL.revokeObjectURL(mainImagesPreview[index]);

    // Remove from previews
    const newPreviews = mainImagesPreview.filter((_, i) => i !== index);
    setMainImagesPreview(newPreviews);
  };

  return {
    mainImagesPreview,
    mainImageInputRef,
    handleFieldChange,
    handleMainImageUpload,
    removeMainImage,
  };
}
