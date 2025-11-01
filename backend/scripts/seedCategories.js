
// backend/scripts/seedCategories.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../src/models/CategoryModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/otakutrack";

const categories = [
  { nombre: "Figuras", slug: "figuras", tipo: "productos" },
  { nombre: "Ropa", slug: "ropa", tipo: "productos" },
  { nombre: "Mangas", slug: "mangas", tipo: "productos" },
  { nombre: "Accesorios", slug: "accesorios", tipo: "productos" }
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Conectado a Mongo para seed");
  for (const c of categories) {
    const exists = await Category.findOne({ slug: c.slug });
    if (!exists) {
      await Category.create(c);
      console.log("Creada", c.slug);
    } else {
      console.log("Ya existe", c.slug);
    }
  }
  await mongoose.disconnect();
  console.log("Seed finalizado");
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
