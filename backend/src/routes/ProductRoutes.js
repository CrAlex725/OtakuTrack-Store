// backend/src/routes/ProductRoutes.js
import express from express;
const router = express.Router();
const productController = require('../controllers/ProductController');

// 🟢 RUTAS ESPECÍFICAS PRIMERO
router.get('/category/:categoryId', productController.getProductsByCategory);

// 🟢 RUTAS DINÁMICAS DESPUÉS
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;