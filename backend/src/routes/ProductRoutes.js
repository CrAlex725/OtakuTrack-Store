const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { getProductsByCategoryAndSubcategories } = require('../controllers/ProductController');

// 🟢 RUTAS ESPECÍFICAS PRIMERO
router.get('/category-with-sub/:id', getProductsByCategoryAndSubcategories);
router.get('/category/:categoryId', productController.getProductsByCategory);

// 🟢 CRUD
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;