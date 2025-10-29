// frontend/src/api/axiosConfig.js
// Unified axios instance using VITE_API_URL (or default to http://localhost:3001)
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, "")) || "http://localhost:3001";

const instance = axios.create({
  baseURL: API_BASE,
  // You can add timeout, headers, interceptors here if needed
});

export default instance;
