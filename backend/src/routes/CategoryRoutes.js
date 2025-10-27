// backend/src/routes/CategoryRoutes.js
import express from express;
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getProductsByCategory
} = require('../controllers/CategoryController');

router.get('/', getAllCategories);
router.post('/', createCategory);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategoryById);
router.get('/:id/products', getProductsByCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
