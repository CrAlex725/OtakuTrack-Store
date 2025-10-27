// server/index.js
// Minimal Express server to serve /api/products and /api/products/:id for local development.

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const products = [
  { id: '1', title: 'Figura Nendoroid - Ejemplo', price: 29.99, stock: 10, descripcion: 'Figura coleccionable', categoria: 'Figuras', images: [] },
  { id: '2', title: 'Manga Vol.1 - Ejemplo', price: 9.99, stock: 5, descripcion: 'Manga en español', categoria: 'Manga', images: [] },
  { id: '3', title: 'Camiseta Anime - Ejemplo', price: 19.99, stock: 0, descripcion: 'Camiseta talla M', categoria: 'Ropa', images: [] }
];

app.get('/api/products', (req, res) => {
  const { page = 1, pageSize = 20, categoria, q } = req.query;
  let items = products.slice();

  if (categoria) items = items.filter(p => String(p.categoria).toLowerCase() === String(categoria).toLowerCase());
  if (q) {
    const ql = String(q).toLowerCase();
    items = items.filter(p => (p.title && p.title.toLowerCase().includes(ql)) || (p.descripcion && p.descripcion.toLowerCase().includes(ql)));
  }

  const total = items.length;
  const p = Math.max(1, parseInt(page,10));
  const ps = Math.max(1, parseInt(pageSize,10));
  const start = (p-1)*ps;
  const pageItems = items.slice(start, start+ps);

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
