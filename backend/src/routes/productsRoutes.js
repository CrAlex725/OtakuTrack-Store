// backend/src/routes/products.js

const express = require('express'); // Importamos express
const router = express.Router();// Importamos Router
const Product = require('../models/ProductModel'); // importamos el modelo creado en models

// 1️⃣ Obtener todos los productos R
router.get('/', async (req, res) => { //Get Lee datos no modifica, 
  try { // intentar
    const products = await/*Encontrar*/ Product.find/*encontrar*/(); // busca todos los productos
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
});

// 2️⃣ Crear un nuevo producto C
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body); // crea un producto con los datos del body
    const savedProduct = await newProduct.save(); // guarda en MongoDB
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto', details: error.message });
  }
});

// 3️⃣ Obtener un producto por ID Search
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error al buscar producto', details: error.message });
  }
});

// 4️⃣ Actualizar un producto U
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar producto', details: error.message });
  }
});

// 5️⃣ Eliminar un producto D
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar producto', details: error.message });
  }
});

module.exports = router;
