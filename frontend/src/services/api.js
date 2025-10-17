//frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

// Traer categorías en forma de árbol
export const getCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories/tree`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const res = await fetch(`${API_URL}/products/category/${categoryId}`);
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    return [];
  }
};