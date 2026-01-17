import { useState, useEffect } from "react";

const useProductVariant = (product) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);

      const initialAttributes = {};
      if (firstVariant.attributes) {
        if (firstVariant.attributes instanceof Map) {
          firstVariant.attributes.forEach((value, key) => {
            initialAttributes[key] = value;
          });
        } else {
          Object.assign(initialAttributes, firstVariant.attributes);
        }
      }
      setSelectedAttributes(initialAttributes);
    } else {
        setSelectedVariant(null);
        setSelectedAttributes({});
    }
  }, [product]);

  const handleAttributeChange = (attributeName, value) => {
    if (!product) return;
    
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    const matchingVariant = product.variants?.find((variant) => {
      if (!variant.attributes) return false;

      return Object.keys(newAttributes).every((key) => {
        let variantValue;
        if (variant.attributes instanceof Map) {
          variantValue = variant.attributes.get(key);
        } else {
          variantValue = variant.attributes[key];
        }
        return variantValue === newAttributes[key];
      });
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  return { selectedVariant, selectedAttributes, handleAttributeChange };
};

export default useProductVariant;
