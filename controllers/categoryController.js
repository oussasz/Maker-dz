import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, arabicName, frenchName, description, parentCategory, image } = req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    const newCategory = new Category({
      name,
      arabicName, 
      frenchName,
      slug,
      description,
      parentCategory: parentCategory || null,
      image,
    });
    const savedCategory = await newCategory.save();
    
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Error creating category" });
  }
};


export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};