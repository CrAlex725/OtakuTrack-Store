import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: {
     type: String,
      required: true 
    }, // SKU

  nombre: {
     type: String, 
     required: true 
    },

  slug: {
     type: String, 
     required: true, 
     unique: true 
    },

  descripcion_larga: {
     type: String 
    },

  precio: {
     type: Number, 
     required: true 
    },

  precio_descuento: {
     type: Number 
    },

  stock: {
     type: Number,
      default: 0 
    },

  categoria_id: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Category", 
     required: true 
    },

  subcategoria_id: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Category" 
    },

  imagen_principal: {
     type: String 
    },

  galeria_imagenes: [
    { type: String }
  ],

  estado: { 
    type: String, 
    enum: ["activo", "inactivo"], 
    default: "activo" 
  },

  destacado: {
     type: Boolean, 
     default: false 
    },

  meta_tags: [
    { type: String }
  ],

  fecha_creacion: {
     type: Date, 
     default: Date.now 
    },

  fecha_actualizacion: {
     type: Date, 
     default: Date.now 
    },
  // Campos específicos para figuras
  altura_cm: {
     type: Number 
    },
  fabricante: {
     type: String 
    },

  serie: {
     type: String 
    },

  material: {
     type: String 
    },

  articulaciones: {
     type: Boolean 
    },

  accesorios_incluidos: { 
    type: String 
  },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
