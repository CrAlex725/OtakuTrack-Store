// backend/src/controllers/CategoryController.js
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";

// 🟢 Crear categoría
export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

// 🟢 Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

// 🟢 Obtener categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(category);
  } catch (error) {
    console.error("❌ Error al obtener categoría:", error);
    res.status(500).json({ message: "Error al obtener categoría" });
  }
};

// 🟢 Actualizar categoría
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(updated);
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

// 🟢 Eliminar categoría
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};
