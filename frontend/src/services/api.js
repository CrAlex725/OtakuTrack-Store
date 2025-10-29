// frontend/src/services/api.js
import axios from "../api/axiosConfig";

/**
 * getProducts espera params: { categoria, q, page, pageSize, minPrecio, maxPrecio, sort }
 * Mapea a lo que el backend espera y además normaliza la respuesta (items/productos).
 */
export async function getProducts(params = {}) {
  const p = {};
  if (params.page) p.page = params.page;
  if (params.pageSize) p.limit = params.pageSize; // backend uses 'limit'
  if (params.categoria) p.categoria = params.categoria;
  if (params.q) p.search = params.q;
  if (params.minPrecio) p.minPrecio = params.minPrecio;
  if (params.maxPrecio) p.maxPrecio = params.maxPrecio;
  if (params.sort) p.sort = params.sort;

  const res = await axios.get('/products', { params: p });
  const data = res.data || {};

  // Normalizar respuesta: soportar { items, total } o { productos, total }
  const items = Array.isArray(data) ? data : (data.items || data.productos || []);
  const total = data.total || (Array.isArray(data) ? data.length : 0);

  return { items, total, raw: data };
}

export async function getProductById(id) {
  const res = await axios.get(`/products/${id}`);
  return res.data;
}

export async function getCategories() {
  // Puedes reemplazar por llamada real si backend expone /api/categories
  return [
    { id: 1, nombre: 'Figuras' },
    { id: 2, nombre: 'Manga' },
    { id: 3, nombre: 'Ropa' },
  ];
}

export async function getCurrentUser() {
  return { id: 1, name: 'Invitado', email: 'invitado@otakutrack.com' };
}
