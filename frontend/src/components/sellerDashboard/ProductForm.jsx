import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import useProductForm from "../../hooks/product/useProductForm";

export default function ProductForm({ data, setData }) {
  const { t } = useTranslation("seller_addproduct");

  const {
    mainImagesPreview,
    mainImageInputRef,
    handleFieldChange,
    handleMainImageUpload,
    removeMainImage,
  } = useProductForm(data, setData);

  return (
    <div className="space-y-4 bg-white/90 p-4 rounded-xl shadow">
      <div>
        <Label>{t("name")}</Label>
        <Input
          value={data.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder={t("product_name_placeholder")}
        />
      </div>

      <div>
        <Label>{t("description")}</Label>
        <Textarea
          value={data.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder={t("describe_product_placeholder")}
        />
      </div>

      <div>
        <Label>{t("price")}</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={data.basePrice}
          onChange={(e) => handleFieldChange("basePrice", e.target.value)}
          placeholder={t("base_price_placeholder")}
        />
      </div>

      {/* IMAGES */}
      <div>
        <Label>{t("main_product_images")}</Label>

        <input
          type="file"
          multiple
          accept="image/*"
          ref={mainImageInputRef}
          hidden
          onChange={(e) => handleMainImageUpload(e.target.files)}
        />

        <div
          onClick={() => mainImageInputRef.current.click()}
          className="w-full mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
        >
          <p className="text-sm text-gray-600">{t("click_to_upload")}</p>
          <p className="text-xs text-gray-400">{t("upload_limit")}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {mainImagesPreview?.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt={`Main product image ${index}`}
                className="w-16 h-16 object-cover rounded border"
              />

              <button
                type="button"
                onClick={() => removeMainImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {mainImagesPreview?.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {t("images_selected", { count: mainImagesPreview.length })}
            {mainImagesPreview.length >= 5 && (
              <span className="text-orange-500 ml-1">
                (Maximum 5 images reached)
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
