// backend/src/controllers/CategoryController.js
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";

/**
 * Crea categoría principal (y si recibe children, los crea recursivamente).
 * Mantén esta versión si ya la reemplazaste por la versión recursiva.
 */
export const createCategory = async (req, res) => {
  try {
    const { nombre, slug, tipo, categoria_padre_id, children, ...rest } = req.body;

    // Crea la categoría principal
    const parentCategory = new Category({
      nombre,
      slug,
      tipo: tipo || (categoria_padre_id ? "subcategoria" : "principal"),
      categoria_padre_id: categoria_padre_id || null,
      ...rest,
    });

    const savedParent = await parentCategory.save();

    // Si hay children en req.body, los guardamos recursivamente
    if (children && Array.isArray(children) && children.length > 0) {
      await saveChildrenRecursively(children, savedParent._id);
    }


    const fullCategory = await Category.findById(savedParent._id);

    res.status(201).json(fullCategory);
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

// Guarda hijos recursivamente (cada hijo saved con categoria_padre_id)
const saveChildrenRecursively = async (children, parentId) => {
  for (const child of children) {
    const { nombre, slug, tipo, children: subchildren, ...rest } = child;
    const newCat = new Category({
      nombre,
      slug,
      tipo: tipo || "subcategoria",
      categoria_padre_id: parentId,
      ...rest,
    });
    const saved = await newCat.save();
    if (subchildren && Array.isArray(subchildren) && subchildren.length > 0) {
      await saveChildrenRecursively(subchildren, saved._id);
    }
  }
};

/** Obtener todas las categorías (lista plana) */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

/** Obtener solo categorías padre (categoria_padre_id === null) */
export const getParentCategories = async (req, res) => {
  try {
    const parentCategories = await Category.find({ categoria_padre_id: null });
    res.json(parentCategories);
  } catch (error) {
    console.error("❌ Error al obtener categorías padre:", error);
    res.status(500).json({ message: "Error al obtener categorías padre" });
  }
};

/** Obtener hijos directos de una categoría */
export const getChildrenByParent = async (req, res) => {
  try {
    const parentId = req.params.id;
    const children = await Category.find({ categoria_padre_id: parentId });
    res.json(children);
  } catch (error) {
    console.error("❌ Error al obtener hijos:", error);
    res.status(500).json({ message: "Error al obtener hijos" });
  }
};

/** Obtener categoria por id (ya tenías) */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(category);
  } catch (error) {
    console.error("❌ Error al obtener categoría:", error);
    res.status(500).json({ message: "Error al obtener categoría" });
  }
};

/** Actualizar categoría (mantener) */
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(updated);
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

/**
 * Crear hijo (añadir una subcategoría a una categoría ya creada)
 * POST /api/categories/:id/children
 */
export const createChildForParent = async (req, res) => {
  try {
    const parentId = req.params.id;
    const { nombre, slug, tipo, ...rest } = req.body;
    // Asegúrate que el padre exista
    const parent = await Category.findById(parentId);
    if (!parent) return res.status(404).json({ message: "Categoría padre no encontrada" });

    const child = new Category({
      nombre,
      slug,
      tipo: tipo || "subcategoria",
      categoria_padre_id: parentId,
      ...rest,
    });

    const savedChild = await child.save();
    res.status(201).json(savedChild);
  } catch (error) {
    console.error("❌ Error al crear subcategoría:", error);
    res.status(500).json({ message: "Error al crear subcategoría" });
  }
};

/**
 * Eliminar recursivamente: elimina la categoría y todas sus descendientes.
 * DELETE /api/categories/:id
 */
export const deleteCategoryRecursive = async (req, res) => {
  try {
    const id = req.params.id;

    // función recursiva para obtener todos los ids a eliminar
    const collectDescendants = async (parentId, acc) => {
      const children = await Category.find({ categoria_padre_id: parentId }).select("_id");
      for (const c of children) {
        acc.push(c._id);
        await collectDescendants(c._id, acc);
      }
    };

    const toDelete = [id];
    await collectDescendants(id, toDelete);

    // elimina por ids
    await Category.deleteMany({ _id: { $in: toDelete } });

    res.json({ message: "Categoría y sus descendientes eliminados", deletedCount: toDelete.length });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};

/**
 * Obtener árbol (padres con hijos anidados) — útil para UI
 * GET /api/categories/tree
 *
 * Implementación simple: obtén todos y arma el árbol en memoria.
 */
export const getCategoriesTree = async (req, res) => {
  try {
    const categories = await Category.find();

    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => {
          if (parentId === null) {
            return !cat.categoria_padre_id; // padres sin padre
          }
          return String(cat.categoria_padre_id) === String(parentId);
        })
        .map(cat => ({
          ...cat.toObject(),
          children: buildTree(cat._id)
        }));
    };

    const tree = buildTree(null);
    return res.json(tree);
  } catch (error) {
    console.error("Error al construir árbol:", error);
    return res.status(500).json({ message: "Error al construir el árbol de categorías" });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};