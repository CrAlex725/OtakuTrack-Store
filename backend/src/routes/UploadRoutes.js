// backend/src/routes/UploadRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📁 Carpeta de destino
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 🧩 Configuración de Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// 📤 Ruta para subir imágenes
router.post("/", upload.array("imagenes"), (req, res) => {
  const imagenes = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ imagenes });
});

export default router;
