import React from "react";

const VariantSelector = ({
  product,
  selectedAttributes,
  handleAttributeChange,
}) => {
  if (!product?.variantOptions) return null;


  return (
    <div className="space-y-4 mt-6">
      {Object.entries(product.variantOptions).map(
        ([attributeName, options]) => {
          const currentValue = selectedAttributes[attributeName];

          return (
            <div key={attributeName} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {attributeName}:{" "}
                <span className="text-gray-600 font-normal">
                  {currentValue || "Select"}
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                  const isSelected = currentValue === option;
                  const isAvailable = product.variants?.some((v) => {
                    let variantValue;
                    if (v.attributes instanceof Map) {
                      variantValue = v.attributes.get(attributeName);
                    } else {
                      variantValue = v.attributes?.[attributeName];
                    }
                    return variantValue === option && v.quantity > 0;
                  });

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        handleAttributeChange(attributeName, option)
                      }
                      disabled={!isAvailable}
                      className={`
                      px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }
                      ${
                        !isAvailable
                          ? "opacity-40 cursor-not-allowed line-through"
                          : "cursor-pointer"
                      }
                    `}>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default VariantSelector;
