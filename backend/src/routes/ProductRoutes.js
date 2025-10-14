// backend/src/routes/ProductRoutes.js
const express = require('express');
const router = express.Router();
const controlador = require('../controllers/ProductController');

// CRUD de productos - USAR NOMBRES EN INGLÉS
router.get('/', controlador.getAllProducts);
router.post('/', controlador.createProduct);
router.get('/:id', controlador.getProductById);
router.put('/:id', controlador.updateProduct);
router.delete('/:id', controlador.deleteProduct);

module.exports = router;