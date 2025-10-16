// backend/src/models/CategoryModel.js
const mongoose = require('mongoose');

// 📘 Esquema jerárquico de Categorías
const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  // 📎 Campo que conecta una categoría con su padre
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // referencia al mismo modelo
    default: null // si es null, es una categoría raíz
  }
}, {
  timestamps: true
});

// 🔒 Índice compuesto: evita duplicados por nombre dentro del mismo parent
categorySchema.index({nombre:1, parent: 1}, {unique: true});

// 📘 Modelo
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
