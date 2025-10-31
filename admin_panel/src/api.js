// admin_panel/src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const CATS = axios.create({
  baseURL: API_BASE + "/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchCategories = () => CATS.get("/categories");        // lista plana
export const fetchCategoriesTree = () => CATS.get("/categories/tree"); // árbol anidado
export const fetchParentCategories = () => CATS.get("/categories/padre");
export const fetchChildren = (parentId) => CATS.get(`/categories/${parentId}/children`);
export const createCategory = (payload) => CATS.post("/categories", payload);
export const createChild = (parentId, payload) => CATS.post(`/categories/${parentId}/children`, payload);
export const updateCategory = (id, payload) => CATS.put(`/categories/${id}`, payload);
export const deleteCategory = (id) => CATS.delete(`/categories/${id}`);
