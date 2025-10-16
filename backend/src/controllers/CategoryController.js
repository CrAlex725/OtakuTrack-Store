// backend/src/controllers/CategoryController.js
const Category = require('../models/CategoryModel');

// 🟢 Obtener todas las categorías (con jerarquía)
exports.getAllCategories = async (req, res) => {
  try {
    // Trae todas y llena el campo "parent" con su info
    const categories = await Category.find().populate('parent', 'nombre');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías', details: error.message });
  }
};

// 🟢 Crear nueva categoría, sub o sub-sub
exports.createCategory = async (req, res) => {
  try {
    const { nombre, descripcion, parent } = req.body;
    const newCategory = new Category({ nombre, descripcion, parent: parent || null });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear categoría', details: error.message });
  }
};

// 🟢 Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'nombre');
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: 'Error al buscar categoría', details: error.message });
  }
};

// 🟢 Actualizar categoría
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar categoría', details: error.message });
  }
};

// 🟢 Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar categoría', details: error.message });
  }
};

// 🧭 Obtener categorías en forma de árbol (jerarquía completa)
exports.getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    // Construimos un mapa (diccionario) para acceder rápido por ID
    const categoryMap = {};
    categories.forEach(cat => {
      cat.subcategorias = [];
      categoryMap[cat._id] = cat;
    });

    // Vinculamos cada categoría con su padre
    const rootCategories = [];
    categories.forEach(cat => {
      if (cat.parent) {
        const parent = categoryMap[cat.parent];
        if (parent) parent.subcategorias.push(cat);
      } else {
        rootCategories.push(cat);
      }
    });

    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({
      error: 'Error al generar árbol de categorías',
      details: error.message
    });
  }
};