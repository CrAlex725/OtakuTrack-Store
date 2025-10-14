// backend/src/routes/CategoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/CategoryController');

router.get('/', getAllCategories);
router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
