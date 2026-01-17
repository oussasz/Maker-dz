import { Label } from "../ui/label";
import { MultiSelect } from "./AddProductModal";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import SpecificationsInput from "./SpecificationsInput";
import useProductAttributes from "../../hooks/product/useProductAttributes";
import useSpecInput from "../../hooks/product/useSpecInput";

const ProductAttributes = ({ data, setData }) => {
  const { t } = useTranslation("seller_addproduct");

  const { categories, removeTag, addTag, tagInput, setTagInput } = useProductAttributes(data, setData);
  const { addSpec, removeSpec, keyVal, setKeyVal } = useSpecInput(setData, data.specifications);

  return (
    <div className="space-y-4 bg-white/90 p-4 rounded-xl shadow">
      <div>
        <Label>{t("categories")}</Label>
        <MultiSelect
          options={categories}
          value={data.categories}
          onChange={(selected) => setData({ ...data, categories: selected })}
          placeholder={t("select_categories_placeholder")}
          selector={"_id"}
        />
      </div>

      <div>
        <Label>{t("tags")}</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder={t("add_tag_placeholder")}
          />
          <button
            onClick={addTag}
            className="bg-primary text-white px-3 py-1 rounded-md">
            {t("add")}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
              onClick={() => removeTag(tag)}>
              {tag} ✕
            </span>
          ))}
        </div>
      </div>

      <SpecificationsInput
        specifications={data.specifications}
        addSpec={addSpec}
        removeSpec={removeSpec}
        keyVal={keyVal}
        setKeyVal={setKeyVal}
      />
    </div>
  );
};

export default ProductAttributes;
