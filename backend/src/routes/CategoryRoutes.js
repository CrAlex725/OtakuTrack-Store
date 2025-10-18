// backend/src/routes/CategoryRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getProductsByCategory,
  getProductsByCategoryAndSubcategories,
  getSubcategories
} = require('../controllers/CategoryController');

// 📂 Árbol de categorías (debe ir primero porque es ruta fija)
router.get('/tree', getCategoryTree);

// 📂 Subcategorías directas
router.get('/parent/:id', getSubcategories);

// 📦 Productos de la categoría + subcategorías
router.get('/:id/products/all', getProductsByCategoryAndSubcategories);

// 📦 Productos solo de la categoría
router.get('/:id/products', getProductsByCategory);

// 📋 CRUD general (estas deben ir al final para no interferir)
router.get('/', getAllCategories);
router.post('/', createCategory);

router.get('/:id', getCategoryById);

router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
