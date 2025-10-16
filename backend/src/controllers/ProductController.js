// backend/src/controllers/ProductController.js
const Product = require('../models/ProductModel');

// 🟢 Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoria', 'nombre descripcion');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};

// 🟢 Crear producto
exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, stock, categoria } = req.body;

    // Si se envía una categoría, validar que exista
    if (categoria) {
      const exists = await Category.findById(categoria);
      if (!exists) {
        return res.status(400).json({ error: 'La categoría especificada no existe' });
      }
    }

    const newProduct = new Product({
      nombre,
      descripcion,
      precio,
      imagen,
      stock,
      categoria,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto', details: error.message });
  }
};

// 🟢 Obtener por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoria', 'nombre descripcion');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error al buscar producto', details: error.message });
  }
};

// 🟢 Actualizar
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('categoria', 'nombre descripcion');
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar producto', details: error.message });
  }
};

// 🟢 Eliminar
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar producto', details: error.message });
  }
};

// 🟣 Obtener productos por categoría
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Cambiado de categoryID a categoryId
    const products = await Product.find({ categoria: categoryId }).populate('categoria', 'nombre');
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos en esta categoría' });
    }

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener productos por categoría', details: error.message });
  }
};