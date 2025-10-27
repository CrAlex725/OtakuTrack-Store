// frontend/src/services/api.js
// Gestiona las llamadas a la API del servidor mock (http://localhost:3001)

import axios from "../api/axiosConfig";

// Obtener todos los productos (con paginación, búsqueda, categoría)
export const getProducts = async (page = 1, pageSize = 20, categoria = "", q = "") => {
  const params = {};
  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;
  if (categoria) params.categoria = categoria;
  if (q) params.q = q;

  const res = await axios.get("/products", { params });
  // El backend devuelve { items, total }
  return res.data;
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  const res = await axios.get(`/products/${id}`);
  return res.data;
};

// Obtener categorías (mock manual)
export const getCategories = async () => {
  // Podrías reemplazar esto luego por una ruta real en el backend
  return [
    { id: 1, name: "Figuras" },
    { id: 2, name: "Manga" },
    { id: 3, name: "Ropa" },
  ];
};

export const getCurrentUser = async () => {
  // Simulación de usuario desde Mock API
  return {
    id: 1,
    name: "Invitado",
    email: "invitado@otakutrack.com",
  };
};
