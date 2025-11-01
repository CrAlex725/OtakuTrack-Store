
// backend/src/controllers/ProductController.js
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

// Obtener todos los productos con filtros, búsqueda y paginación
export const getAllProducts = async (req, res) => {
  try {
    const { search, categoria, minPrecio, maxPrecio, page = 1, limit = 50, sort } = req.query;
    const filtro = {};

    if (search) {
      filtro.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { descripcion: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } }
      ];
    }

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (minPrecio) filtro.precio = { ...filtro.precio, $gte: Number(minPrecio) };
    if (maxPrecio) filtro.precio = { ...filtro.precio, $lte: Number(maxPrecio) };

    let q = Product.find(filtro).populate("categoria", "nombre slug");

    // sorting
    if (sort) {
      q = q.sort(sort);
    } else {
      q = q.sort({ createdAt: -1 });
    }

    const total = await Product.countDocuments(filtro);
    const pageNum = Math.max(1, Number(page));
    const docs = await q.skip((pageNum - 1) * Number(limit)).limit(Number(limit));

    return res.json({ items: docs, total, page: pageNum });
  } catch (error) {
    console.error("Error getAllProducts:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate("categoria", "nombre slug");
    if (!p) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(p);
  } catch (error) {
    console.error("Error getProductById:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const payload = req.body || {};
    // Asegurarse de que categoria exista (opcional)
    if (payload.categoria) {
      const cat = await Category.findById(payload.categoria);
      if (!cat) return res.status(400).json({ error: "Categoría no válida" });
    }

    // Normalizar campos numéricos
    if (payload.precio) payload.precio = Number(payload.precio);
    if (payload.precio_descuento) payload.precio_descuento = Number(payload.precio_descuento);
    if (payload.stock) payload.stock = Number(payload.stock);

    const product = new Product(payload);
    await product.save();
    const populated = await Product.findById(product._id).populate("categoria", "nombre slug");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error createProduct:", error);
    res.status(400).json({ error: "Error al crear producto", details: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = req.body || {};
    if (updates.precio) updates.precio = Number(updates.precio);
    if (updates.precio_descuento) updates.precio_descuento = Number(updates.precio_descuento);
    if (updates.stock) updates.stock = Number(updates.stock);

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).populate("categoria", "nombre slug");
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    console.error("Error updateProduct:", error);
    res.status(400).json({ error: "Error al actualizar producto", details: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error deleteProduct:", error);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) return res.status(400).json({ error: "categoryId es requerido" });
    const products = await Product.find({ categoria: categoryId }).populate("categoria", "nombre slug");
    if (!products || products.length === 0) return res.status(404).json({ message: "No se encontraron productos en esta categoría" });
    res.json(products);
  } catch (error) {
    console.error("Error getProductsByCategory:", error);
    res.status(400).json({ error: "Error al obtener productos por categoría", details: error.message });
  }
};

// 📸 Subida de imágenes
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No se subieron imágenes" });
    }

    const imagePaths = req.files.map((file) => `/uploads/products/${file.filename}`);

    return res.status(200).json({
      message: "Imágenes subidas correctamente",
      imagenes: imagePaths,
    });
  } catch (error) {
    console.error("Error al subir imágenes:", error);
    res.status(500).json({ error: "Error al subir imágenes" });
  }
};