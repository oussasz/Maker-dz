import { Label } from "../ui/label";
import { MultiSelect } from "./AddProductModal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import SpecificationsInput from "./SpecificationsInput";
import useProductAttributes from "../../hooks/product/useProductAttributes";
import useSpecInput from "../../hooks/product/useSpecInput";
import { Tag, Folder, Plus, X, Sparkles, ListPlus, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ProductAttributesEnhanced = ({ data, setData }) => {
  const { t } = useTranslation("seller_addproduct");
  const [tagInputFocused, setTagInputFocused] = useState(false);

  const { categories, removeTag, addTag, tagInput, setTagInput } =
    useProductAttributes(data, setData);
  const { addSpec, removeSpec, keyVal, setKeyVal } = useSpecInput(
    setData,
    data.specifications
  );

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Popular tag suggestions
  const suggestedTags = [
    "Handmade",
    "Traditional",
    "Artisanal",
    "Vintage",
    "Custom",
    "Limited Edition",
  ];
  const availableSuggestions = suggestedTags.filter(
    (tag) => !data.tags.includes(tag)
  );

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Folder size={16} className="text-primary" />
          {t("categories")}
        </Label>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <MultiSelect
            options={categories}
            value={data.categories}
            onChange={(selected) => setData({ ...data, categories: selected })}
            placeholder={t("select_categories_placeholder")}
            selector={"_id"}
          />
          <p className="text-xs text-gray-500 mt-2">
            Select categories that best describe your product
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Hash size={16} className="text-primary" />
          {t("tags")}
        </Label>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
          {/* Tag Input */}
          <div className="flex gap-2">
            <div
              className={`relative flex-1 transition-all duration-300 ${
                tagInputFocused ? "ring-2 ring-primary/20 rounded-lg" : ""
              }`}
            >
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onFocus={() => setTagInputFocused(true)}
                onBlur={() => setTagInputFocused(false)}
                onKeyDown={handleTagKeyDown}
                placeholder={t("add_tag_placeholder")}
                className="h-11 border-gray-200 focus:border-primary"
              />
            </div>
            <Button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="h-11 px-6 gap-2"
            >
              <Plus size={18} />
              {t("add")}
            </Button>
          </div>

          {/* Suggested Tags */}
          {availableSuggestions.length > 0 && data.tags.length < 10 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles size={12} />
                Suggested tags
              </p>
              <div className="flex flex-wrap gap-2">
                {availableSuggestions.slice(0, 4).map((tag) => (
                  <motion.button
                    key={tag}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setData({ ...data, tags: [...data.tags, tag] });
                    }}
                    className="px-3 py-1.5 text-sm bg-white border border-dashed border-gray-300 text-gray-600 rounded-full hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Plus size={12} />
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Added Tags */}
          <AnimatePresence>
            {data.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <p className="text-xs text-gray-500">
                  Added tags ({data.tags.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      <Tag size={12} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <ListPlus size={16} className="text-primary" />
          Specifications
        </Label>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <SpecificationsInputEnhanced
            specifications={data.specifications}
            addSpec={addSpec}
            removeSpec={removeSpec}
            keyVal={keyVal}
            setKeyVal={setKeyVal}
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced Specifications Input
const SpecificationsInputEnhanced = ({
  specifications,
  addSpec,
  removeSpec,
  keyVal,
  setKeyVal,
}) => {
  const { t } = useTranslation("seller_addproduct");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpec();
    }
  };

  const specArray =
    specifications instanceof Map
      ? Array.from(specifications.entries())
      : Object.entries(specifications || {});

  return (
    <div className="space-y-4">
      {/* Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-2">
        <Input
          value={keyVal.key || ""}
          onChange={(e) => setKeyVal({ ...keyVal, key: e.target.value })}
          placeholder="e.g., Material"
          className="h-11 border-gray-200"
          onKeyDown={handleKeyDown}
        />
        <Input
          value={keyVal.value || ""}
          onChange={(e) => setKeyVal({ ...keyVal, value: e.target.value })}
          placeholder="e.g., Ceramic"
          className="h-11 border-gray-200"
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          onClick={addSpec}
          disabled={!keyVal.key?.trim() || !keyVal.value?.trim()}
          className="h-11 px-6 gap-2"
        >
          <Plus size={18} />
          Add
        </Button>
      </div>

      {/* Specifications List */}
      <AnimatePresence>
        {specArray.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <p className="text-xs text-gray-500">
              Added specifications ({specArray.length})
            </p>
            <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {specArray.map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpec(key)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {specArray.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Add specifications like Material, Dimensions, Weight, etc.
        </p>
      )}
    </div>
  );
};

export default ProductAttributesEnhanced;
