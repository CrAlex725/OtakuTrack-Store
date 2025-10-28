// backend/src/routes/ProductRoutes.js
import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from "../controllers/ProductController.js";

const router = express.Router();

// 🟢 RUTAS ESPECÍFICAS PRIMERO
router.get("/category/:categoryId", getProductsByCategory);

// 🟢 RUTAS CRUD
router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
