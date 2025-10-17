// backend/src/routes/ProductRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// 🟢 RUTAS ESPECÍFICAS PRIMERO
router.get('/category/:id', productController.getProductsByCategory);

// 🟢 RUTAS DINÁMICAS DESPUÉS
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;