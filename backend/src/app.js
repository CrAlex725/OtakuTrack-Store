// backend/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// IMPORTS RELATIVOS y con el nombre correcto según archivos en /routes
import productRoutes from "./routes/ProductRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// servir uploads (usa path.resolve para rutas absolutas)
app.use("/uploads", express.static(path.resolve("uploads")));

// Rutas API
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.json({ message: "✅ API funcionando correctamente 🚀" });
});

export default app;
