// admin_panel/src/api.js
import axios from "axios";

// 🔧 La URL base del backend viene desde .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Exportamos por defecto
export default API;
