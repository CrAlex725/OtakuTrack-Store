import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },

  slug: {
     type: String, 
     required: true, 
     unique: true 
    },

  tipo: {
   type: String,
   enum: ["principal", "subcategoria", "otro"],
   default: "principal"
},

  categoria_padre_id: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Category", 
     default: null 
    },
    
  imagen_categoria: {
     type: String 

  },
  descripcion: {
     type: String 
  },

  meta_titulo: {
     type: String 
  },

  meta_descripcion: {
     type: String 
    },

}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
