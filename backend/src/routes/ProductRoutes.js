// backend/src/routes/ProductRoutes.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  uploadProductImages
} from "../controllers/ProductController.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🧩 Rutas de productos
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:categoryId", getProductsByCategory);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// 📸 Nueva ruta para subir imágenes
router.post("/upload", upload.array("imagenes", 5), uploadProductImages);

export default router;
