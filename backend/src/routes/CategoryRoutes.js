// backend/src/routes/CategoryRoutes.js
import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategoryRecursive,
  getParentCategories,
  getChildrenByParent,
  createChildForParent,
  getCategoriesTree
} from "../controllers/CategoryController.js";

const router = express.Router();

router.post("/", createCategory);                 // crear (con children opcional)
router.get("/", getCategories);                   // lista plana

router.get("/tree", getCategoriesTree);          // árbol anidado
router.get("/padre", getParentCategories);        // solo padres (categoria_padre_id === null)

router.get("/:id/children", getChildrenByParent); // hijos directos de un padre
router.post("/:id/children", createChildForParent);// crear hijo para padre existente
router.get("/:id", getCategoryById);              // obtener por id
router.put("/:id", updateCategory);               // actualizar
router.delete("/:id", deleteCategoryRecursive);   // eliminar recursivamente

export default router;