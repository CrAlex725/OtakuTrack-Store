// backend/src/controllers/ProductController.js
const Product = require('../models/ProductModel');

// 🟢 Obtener todos los productos con filtros, búsqueda y paginación
exports.getAllProducts = async (req, res) => {
  try {
    const { search, categoria, minPrecio, maxPrecio, page = 1, limit = 10, sort } = req.query;

    const filtro = {};

    // 🔍 Buscar por nombre o descripción (insensible a mayúsculas)
    if (search) {
      filtro.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }

    // 🏷️ Filtrar por categoría (y sus subcategorías)
    if (categoria) {
      filtro.categoria = categoria;
    }

    // 💰 Filtrar por rango de precio
    if (minPrecio || maxPrecio) {
      filtro.precio = {};
      if (minPrecio) filtro.precio.$gte = Number(minPrecio);
      if (maxPrecio) filtro.precio.$lte = Number(maxPrecio);
    }

    // 📄 Paginación
    const skip = (Number(page) - 1) * Number(limit);

    // 🔽 Orden (por ejemplo: ?sort=precio o ?sort=-precio para descendente)
    const orden = sort ? sort.replace(',', ' ') : '-createdAt';

    // 🧾 Ejecutamos la consulta
    const [productos, total] = await Promise.all([
      Product.find(filtro)
        .populate('categoria', 'nombre descripcion')
        .sort(orden)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filtro)
    ]);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      productos
    });
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

      // ✅ Validar que la categoría no tenga subcategorías
      const tieneHijos = await Category.exists({ parent: categoria });
      if (tieneHijos) {
        return res.status(400).json({
          error: 'No se puede crear un producto en una categoría que tiene subcategorías. Seleccione una categoría hoja.'
        });
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
    // La ruta usa :categoryId — usar el mismo nombre aquí
    const { categoryId } = req.params;
    if(!categoryId) {
      return res.status(400).json({ error: 'categoryId es requerido' });
    }

    const products = await Product.find({ categoria: categoryId }).populate('categoria', 'nombre');

    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos en esta categoría' });
    }

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener productos por categoría', details: error.message });
  }
};;

const Category = require('../models/CategoryModel');

exports.getProductsByCategoryAndSubcategories = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Buscar subcategorías (nivel 1)
    const subcategories = await Category.find({ parent: categoryId }).select('_id');

    // Crear array con el ID padre + subcategorías
    const categoryIds = [categoryId, ...subcategories.map(cat => cat._id)];

    // Buscar productos que pertenezcan a alguna de esas categorías
    const products = await Product.find({ categoria: { $in: categoryIds } });

    res.json(products);
  } catch (error) {
    console.error('❌ Error al obtener productos por categoría y subcategorías:', error);
    res.status(500).json({ message: 'Error al obtener productos por categoría y subcategorías' });
  }
};