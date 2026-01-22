import { Category } from "../../models/mysql/index.js";

export const createCategory = async (req, res) => {
  try {
    const { name, arabicName, frenchName, description, parentCategory, image } =
      req.body;
    const slug = name.toLowerCase().replace(/ /g, "-");

    const categoryId = await Category.create({
      name,
      arabic_name: arabicName,
      french_name: frenchName,
      slug,
      description,
      parent_id: parentCategory || null,
      image,
    });

    const savedCategory = await Category.findById(categoryId);

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Error creating category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const withCounts = req.query.withCounts === "true";

    const categories = withCounts
      ? await Category.findAllWithProductCounts({ activeOnly })
      : await Category.findAll({ activeOnly });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findBySlug(slug);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Error fetching category" });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Category.getSubcategories(categoryId);
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Error fetching subcategories" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      name,
      arabicName,
      frenchName,
      description,
      parentCategory,
      image,
      isActive,
    } = req.body;

    const updates = {};
    if (name) {
      updates.name = name;
      updates.slug = name.toLowerCase().replace(/ /g, "-");
    }
    if (arabicName) updates.arabic_name = arabicName;
    if (frenchName) updates.french_name = frenchName;
    if (description) updates.description = description;
    if (parentCategory !== undefined) updates.parent_id = parentCategory;
    if (image) updates.image = image;
    if (isActive !== undefined) updates.is_active = isActive;

    const success = await Category.updateById(categoryId, updates);

    if (!success) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await Category.findById(categoryId);
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Error updating category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Soft delete by setting is_active to false
    const success = await Category.updateById(categoryId, { is_active: false });

    if (!success) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Error deleting category" });
  }
};
