const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');

// 🟢 Obtener todas las categorías (con jerarquía)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parent', 'nombre');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías', details: error.message });
  }
};

// 🟢 Crear nueva categoría o subcategoría
exports.createCategory = async (req, res) => {
  try {
    const { nombre, descripcion, parent } = req.body;
    const newCategory = new Category({ nombre, descripcion, parent: parent || null });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Esta categoría ya existe',
        details: 'Ya existe una categoría con este nombre dentro del mismo nivel'
      });
    }
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

    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Categoría duplicada',
        details: 'Ya existe otra categoría con este nombre en el mismo nivel'
      });
    }
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

// 🧭 Obtener jerarquía completa (árbol de categorías)
exports.getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().lean();


    const categoryMap = {};
    categories.forEach(cat => {
      cat.subcategorias = [];
      categoryMap[cat._id] = cat;
    });


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
    res.status(500).json({ error: 'Error al generar árbol de categorías', details: error.message });
  }
};

// 🟢 Obtener subcategorías directas de una categoría
exports.getSubcategories = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategories = await Category.find({ parent: id });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener subcategorías', details: error.message });
  }
};

// 🟢 Obtener productos SOLO de una categoría (sin subcategorías)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;


    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });


    const products = await Product.find({ categoria: id }).populate('categoria', 'nombre descripcion');
    
    res.json({
      categoria: category.nombre,
      cantidad: products.length,
      productos: products
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener productos de la categoría', details: error.message });
  }
};

// 🟣 Obtener productos de la categoría + todas sus subcategorías (recursivo)
exports.getProductsByCategoryAndSubcategories = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rootCategory = await Category.findById(id);
    if (!rootCategory)
      return res.status(404).json({ message: 'Categoría no encontrada' });

    // 🔁 Recursividad para buscar subcategorías
    const getAllSubcategories = async (parentId) => {
      const subs = await Category.find({ parent: parentId });
      let all = [...subs];
      for (const sub of subs) {
        const nested = await getAllSubcategories(sub._id);
        all = all.concat(nested);
      }
      return all;
    };


    const subcategories = await getAllSubcategories(id);
    const allCategoryIds = [id, ...subcategories.map(cat => cat._id)];


    const products = await Product.find({ categoria: { $in: allCategoryIds } })
      .populate('categoria', 'nombre');

    res.json({
      categoria: rootCategory.nombre,
      totalCategorias: allCategoryIds.length,
      totalProductos: products.length,
      productos: products
    });

  } catch (error) {
    res.status(400).json({
      error: 'Error al obtener productos de la categoría y subcategorías',
      details: error.message
    });
  }
};
