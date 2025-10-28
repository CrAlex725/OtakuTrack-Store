// server/index.js
// Mock Express server returning Spanish field names compatible with backend models

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const products = [
  { id: '1', nombre: 'Figura Nendoroid - Ejemplo', precio: 29990, stock: 10, descripcion: 'Figura coleccionable', categoria: 'Figuras', images: [] },
  { id: '2', nombre: 'Manga Vol.1 - Ejemplo', precio: 9990, stock: 5, descripcion: 'Manga en español', categoria: 'Manga', images: [] },
  { id: '3', nombre: 'Camiseta Anime - Ejemplo', precio: 19990, stock: 0, descripcion: 'Camiseta talla M', categoria: 'Ropa', images: [] }
];

app.get('/api/products', (req, res) => {
  const { page = 1, limit = 20, categoria, search } = req.query;
  let items = products.slice();

  if (categoria) {
    items = items.filter(p => String(p.categoria).toLowerCase() === String(categoria).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(p => (p.nombre && p.nombre.toLowerCase().includes(q)) || (p.descripcion && p.descripcion.toLowerCase().includes(q)));
  }

  const total = items.length;
  const p = Math.max(1, parseInt(page, 10));
  const lim = Math.max(1, parseInt(limit, 10));
  const start = (p - 1) * lim;
  const pageItems = items.slice(start, start + lim);

  res.json({ items: pageItems, total });
});

app.get('/api/products/:id', (req, res) => {
  const id = String(req.params.id);
  const prod = products.find(p => String(p.id) === id);
  if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(prod);
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
