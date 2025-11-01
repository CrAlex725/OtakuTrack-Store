// admin_panel/src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const CATS = axios.create({
  baseURL: API_BASE + "/api",
  headers: { "Content-Type": "application/json" },
});

// ---------- Categorías (ya existentes en tu repo) ----------
export const fetchCategories = () => CATS.get("/categories");
export const fetchCategoriesTree = () => CATS.get("/categories/tree");
export const fetchParentCategories = () => CATS.get("/categories/padre");
export const fetchChildren = (parentId) => CATS.get(`/categories/${parentId}/children`);
export const createCategory = (payload) => CATS.post("/categories", payload);
export const createChild = (parentId, payload) => CATS.post(`/categories/${parentId}/children`, payload);
export const updateCategory = (id, payload) => CATS.put(`/categories/${id}`, payload);
export const deleteCategory = (id) => CATS.delete(`/categories/${id}`);

// ---------- Productos ----------
export const fetchProducts = (params) => CATS.get("/products", { params });
export const getProductById = (id) => CATS.get(`/products/${id}`);
export const createProduct = (payload) => CATS.post("/products", payload);
export const updateProduct = (id, payload) => CATS.put(`/products/${id}`, payload);
export const deleteProduct = (id) => CATS.delete(`/products/${id}`);
export const getProductsByCategory = (categoryId) => CATS.get(`/products/category/${categoryId}`);
