//backend/src/models/UserModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true
},

  password_hash: {
     type: String, 
     required: true 
    },

  nombre: { 
    type: String 
},

  apellido: { 
    type: String 
},

  telefono: {
     type: String 
    },

  direccion: [{
    calle: String,
    ciudad: String,
    region: String
  }],
  
  fecha_registro: { 
    type: Date, 
    default: Date.now 
},

  rol: {
     type: String, 
     enum: ["cliente", "admin"], 
     default: "cliente" 
    },

  estado: {
     type: String, 
     enum: ["activo", "inactivo"], 
     default: "activo" 
    },

  preferencias: {
    categoriasVistas: [String],
    tallasFavoritas: [String]
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
