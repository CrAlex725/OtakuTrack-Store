// backend/src/middlewares/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ruta destino
const uploadDir = path.resolve("uploads/products");

// Crear si no existe
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

// Filtro de tipo de archivo
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Solo se permiten imágenes"), false);
};

const upload = multer({ storage, fileFilter });

export default upload;
