import { useState } from "react";

export default function useSpecInput(setData, specifications) {
  const [keyVal, setKeyVal] = useState({ key: "", value: "" });

  const addSpec = () => {
    if (keyVal.key && keyVal.value) {
      // Create a new Map from the current specifications and add the new key-value pair
      const newSpecs = new Map(specifications);
      newSpecs.set(keyVal.key, keyVal.value);
      setData((prev) => ({ ...prev, specifications: newSpecs }));
      setKeyVal({ key: "", value: "" });
    }
  };

  const removeSpec = (key) => {
    const newSpecs = new Map(specifications);
    newSpecs.delete(key);
    setData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  return {
    addSpec,
    removeSpec,
    keyVal,
    setKeyVal,
  };
}
