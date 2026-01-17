import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function useProductAttributes(initialData, setData) {
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [keyVal, setKeyVal] = useState({ key: "", value: "" });

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput && !initialData.tags.includes(tagInput)) {
      setData({ ...initialData, tags: [...initialData.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setData({
      ...initialData,
      tags: initialData.tags.filter((t) => t !== tag),
    });
  };

  const getCategories = async () => {
    try {
      const response = await axios.get("/category/all");
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const addSpec = () => {
    if (keyVal.key && keyVal.value) {
      // Create a new Map from the current specifications and add the new key-value pair
      const newSpecs = new Map(specifications);
      newSpecs.set(keyVal.key, keyVal.value);
      setData({ ...data, specifications: newSpecs });
      setKeyVal({ key: "", value: "" });
    }
  };

  const removeSpec = (key) => {
    const newSpecs = new Map(specifications);
    newSpecs.delete(key);
    setData({ ...data, specifications: newSpecs });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    removeTag,
    addTag,
    tagInput,
    setTagInput,
    addSpec,
    removeSpec,
    keyVal,
    setKeyVal
  };
}
