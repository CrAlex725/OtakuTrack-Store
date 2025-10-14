// backend/src/models/Product.js

const mongoose = require('mongoose'); // importamos mongoose al archivo

// 1️⃣ Definimos la estructura (esquema/Schema) de un producto:
const productSchema = new mongoose.Schema({
  nombre: {
    type: String,       // el tipo de dato (texto)
    required: true      // campo obligatorio
  },
  descripcion: {
    type: String,       // breve texto descriptivo
    required: false
  },
  precio: {
    type: Number,       // número (en pesos chilenos o la moneda que uses)
    required: true
  },
  imagen: {
    type: String,       // URL o ruta de la imagen del producto
    required: false
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',       // Ej: “Naruto”, “One Piece”, “Kimetsu no Yaiba”
    required: false
  },
  stock: {
    type: Number,       // cuántas unidades hay disponibles
    default: 0          // valor por defecto
  },
}, {
  timestamps: true // agrega automáticamente 'createdAt' y 'updatedAt'
});

// 2️⃣ Creamos el modelo 'Product' a partir del esquema
const Product = mongoose.model/*modelo*/('Product', productSchema);

// 3️⃣ Lo exportamos para usarlo en otras partes del proyecto
module.exports = Product;
