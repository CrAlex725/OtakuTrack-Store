// backend/src/server.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/otakutrack";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB correctamente");
    app.listen(PORT, () => console.log(`🚀 Backend escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));
