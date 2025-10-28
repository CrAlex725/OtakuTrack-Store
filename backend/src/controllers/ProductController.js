// backend/src/controllers/ProductController.js
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js"; // 🔥 Import faltante

// 🟢 Obtener todos los productos con filtros, búsqueda y paginación
export const getAllProducts = async (req, res) => {
  try {
    const { search, categoria, minPrecio, maxPrecio, page = 1, limit = 10, sort } = req.query;

    const filtro = {};

    if (search) {
      filtro.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { descripcion: { $regex: search, $options: "i" } }
      ];
    }

    if (categoria) filtro.categoria = categoria;

    if (minPrecio || maxPrecio) {
      filtro.precio = {};
      if (minPrecio) filtro.precio.$gte = Number(minPrecio);
      if (maxPrecio) filtro.precio.$lte = Number(maxPrecio);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orden = sort ? sort.replace(",", " ") : "-createdAt";

    const [productos, total] = await Promise.all([
      Product.find(filtro)
        .populate("categoria", "nombre descripcion")
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
    res.status(500).json({ error: "Error al obtener productos", details: error.message });
  }
};

// 🟢 Crear producto
export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, stock, categoria } = req.body;

    if (categoria) {
      const exists = await Category.findById(categoria);
      if (!exists) {
        return res.status(400).json({ error: "La categoría especificada no existe" });
      }

      const tieneHijos = await Category.exists({ parent: categoria });
      if (tieneHijos) {
        return res.status(400).json({
          error: "No se puede crear un producto en una categoría que tiene subcategorías. Seleccione una categoría hoja."
        });
      }
    }

    const newProduct = new Product({
      nombre,
      descripcion,
      precio,
      imagen,
      stock,
      categoria
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(400).json({ error: "Error al crear producto", details: error.message });
  }
};

// 🟢 Obtener por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoria", "nombre descripcion");
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Error al buscar producto", details: error.message });
  }
};

// 🟢 Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("categoria", "nombre descripcion");
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar producto", details: error.message });
  }
};

// 🟢 Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar producto", details: error.message });
  }
};

// 🟣 Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ error: "categoryId es requerido" });
    }

    const products = await Product.find({ categoria: categoryId }).populate("categoria", "nombre");

    if (products.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos en esta categoría" });
    }

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener productos por categoría", details: error.message });
  }
};
