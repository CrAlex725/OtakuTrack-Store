// frontend/src/services/api.js
// Gestiona las llamadas a la API del servidor mock (http://localhost:3001/api)

import axios from "../api/axiosConfig";

/**
 * params: { categoria, q, page, pageSize, minPrecio, maxPrecio, sort }
 */
export async function getProducts(params = {}) {
  const p = {};
  if (params.page) p.page = params.page;
  if (params.pageSize) p.limit = params.pageSize; // backend expects 'limit'
  if (params.categoria) p.categoria = params.categoria;
  if (params.q) p.search = params.q;
  if (params.minPrecio) p.minPrecio = params.minPrecio;
  if (params.maxPrecio) p.maxPrecio = params.maxPrecio;
  if (params.sort) p.sort = params.sort;

  const res = await axios.get('/products', { params: p });
  return res.data; // backend returns either array or { items, total }
}

// Obtener un producto por ID
export async function getProductById(id) {
  const res = await axios.get(`/products/${id}`);
  return res.data;
}

// Obtener categorías (mock manual por ahora)
export async function getCategories() {
  return [
    { id: 1, nombre: 'Figuras' },
    { id: 2, nombre: 'Manga' },
    { id: 3, nombre: 'Ropa' },
  ];
}

export async function getCurrentUser() {
  return {
    id: 1,
    name: 'Invitado',
    email: 'invitado@otakutrack.com'
  };
}
