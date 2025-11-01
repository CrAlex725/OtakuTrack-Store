//backend/src/models/ProductModel.js

import mongoose from "mongoose";

// Esquema base para todos los productos
const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  descripcion_corta: {
    type: String,
    required: true,
    maxlength: 300
  },

  descripcion_larga: {
    type: String,
    maxlength: 2000
  },

  precio: {
    type: Number,
    required: true,
    min: 0
  },

  precio_descuento: {
    type: Number,
    min: 0,
    validate: {
      validator: function(value) {
        return value <= this.precio;
      },
      message: "El precio de descuento no puede ser mayor al precio regular"
    }
  },

  porcentaje_descuento: {
    type: Number,
    min: 0,
    max: 100
  },

  stock: {
    type: Number,
    default: 0,
    min: 0
  },

  categoria: {
    type: String,
    required: true,
    enum: ["figuras", "ropa", "mangas", "accesorios"]
  },

  subcategoria: {
    type: String,
    trim: true
  },

  imagen_principal: {
    type: String,
    required: true
  },

  galeria_imagenes: [{
    type: String
  }],

  estado: {
    type: String,
    enum: ["activo", "inactivo", "agotado", "descontinuado"],
    default: "activo"
  },

  destacado: {
    type: Boolean,
    default: false
  },

  // Atributos comunes a todos los productos otaku
  licencia: {
    type: String,
    required: true,
    trim: true
  }, // Ej: "Naruto", "Demon Slayer", "One Piece"

  serie: {
    type: String,
    trim: true
  }, // Serie específica dentro de la licencia

  marca: {
    type: String,
    trim: true
  }, // Fabricante o marca

  origen: {
    type: String,
    enum: ["japon", "china", "corea", "usa", "taiwan", "otros"],
    default: "japon"
  },

  // Información de envío y peso
  peso_kg: {
    type: Number,
    min: 0
  },

  dimensiones: {
    alto: Number, // cm
    ancho: Number, // cm
    profundidad: Number // cm
  },

  // Metadatos y SEO
  meta_titulo: String,
  meta_descripcion: String,
  meta_tags: [String],

  // Estadísticas y popularidad
  vistas: {
    type: Number,
    default: 0
  },

  ventas_totales: {
    type: Number,
    default: 0
  },

  // Control de inventario
  stock_minimo: {
    type: Number,
    default: 5
  },

  gestion_inventario: {
    type: Boolean,
    default: true
  },

  // Fechas importantes
  fecha_lanzamiento: Date,
  fecha_discontinuacion: Date

}, {
  timestamps: true,
  discriminatorKey: "tipoProducto",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejor performance
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ categoria: 1, estado: 1 });
productSchema.index({ licencia: 1 });
productSchema.index({ precio: 1 });
productSchema.index({ destacado: 1, estado: 1 });
productSchema.index({ "dimensiones.alto": 1, "dimensiones.ancho": 1 });

// Virtuals
productSchema.virtual("en_descuento").get(function() {
  return this.precio_descuento && this.precio_descuento < this.precio;
});

productSchema.virtual("precio_final").get(function() {
  return this.precio_descuento && this.precio_descuento < this.precio ? this.precio_descuento : this.precio;
});

productSchema.virtual("stock_bajo").get(function() {
  return this.stock <= this.stock_minimo;
});

productSchema.virtual("agotado").get(function() {
  return this.stock === 0;
});

// Middleware pre-save
productSchema.pre("save", function(next) {
  // Calcular porcentaje de descuento si existe precio_descuento
  if (this.precio_descuento && this.precio > 0) {
    this.porcentaje_descuento = Math.round(((this.precio - this.precio_descuento) / this.precio) * 100);
  }
  
  // Actualizar estado basado en stock
  if (this.stock === 0 && this.estado !== "descontinuado") {
    this.estado = "agotado";
  } else if (this.stock > 0 && this.estado === "agotado") {
    this.estado = "activo";
  }
  
  next();
});

// Métodos estáticos
productSchema.statics.porCategoria = function(categoria) {
  return this.find({ categoria, estado: "activo" });
};

productSchema.statics.porLicencia = function(licencia) {
  return this.find({ licencia, estado: "activo" });
};

productSchema.statics.destacados = function() {
  return this.find({ destacado: true, estado: "activo" });
};

productSchema.statics.enDescuento = function() {
  return this.find({ 
    precio_descuento: { $exists: true, $ne: null },
    estado: "activo"
  });
};

// Métodos de instancia
productSchema.methods.aumentarVistas = function() {
  this.vistas += 1;
  return this.save();
};

productSchema.methods.reducirStock = function(cantidad) {
  if (this.stock >= cantidad) {
    this.stock -= cantidad;
    this.ventas_totales += cantidad;
    return this.save();
  }
  throw new Error("Stock insuficiente");
};

// Crear el modelo base
export const ProductModel = mongoose.model("Product", productSchema);

// ============================================================================
// DISCRIMINADORES - Esquemas específicos por categoría
// ============================================================================

// 1. Esquema para FIGURAS
export const FiguraModel = ProductModel.discriminator("Figura", 
  new mongoose.Schema({
    // Atributos específicos de figuras
    tipo_figura: {
      type: String,
      enum: ["scale", "nendoroid", "figma", "pop_up_parade", "prize", "garage_kit", "otros"],
      required: true
    },
    
    escala: String, // Ej: "1/7", "1/8", "1/6"
    
    altura_cm: {
      type: Number,
      required: true
    },
    
    fabricante: {
      type: String,
      required: true
    }, // Ej: "Good Smile Company", "Kotobukiya", "Max Factory"
    
    material: {
      type: [String],
      enum: ["pvc", "abs", "resina", "polystone", "vinilo", "otros"]
    },
    
    articulaciones: Boolean,
    
    accesorios_incluidos: [String], // Lista de accesorios
    
    personaje: {
      type: String,
      required: true
    }, // Nombre específico del personaje
    
    numero_edicion: String,
    
    edicion_especial: Boolean,
    
    fecha_lanzamiento_original: Date,
    
    // Para figuras usadas o raras
    condicion: {
      type: String,
      enum: ["nuevo", "usado_excelente", "usado_bueno", "usado_regular"],
      default: "nuevo"
    },
    
    con_caja: Boolean
  })
);

// 2. Esquema para MANGAS
export const MangaModel = ProductModel.discriminator("Manga",
  new mongoose.Schema({
    // Atributos específicos de mangas
    autor: {
      type: String,
      required: true
    },
    
    artista: String, // En caso de que sea diferente del autor
    
    editorial: {
      type: String,
      required: true
    }, // Ej: "Ivrea", "Panini", "Norma"
    
    isbn: {
      type: String,
      unique: true,
      sparse: true
    },
    
    numero_volumen: {
      type: Number,
      required: true
    },
    
    total_volumenes: Number, // Total de volúmenes en la serie
    
    paginas: {
      type: Number,
      required: true
    },
    
    formato: {
      type: String,
      enum: ["tankobon", "kanzenban", "bunko", "digital", "encolado", "otros"],
      default: "tankobon"
    },
    
    fecha_publicacion_original: Date,
    
    fecha_publicacion_espanol: Date,
    
    idioma: {
      type: String,
      enum: ["español", "ingles", "japones", "otros"],
      default: "español"
    },
    
    edad_recomendada: {
      type: String,
      enum: ["todas", "12+", "16+", "18+"],
      default: "todas"
    },
    
    tipo_manga: {
      type: String,
      enum: ["shonen", "shojo", "seinen", "josei", "kodomo", "otros"]
    },
    
    // Para mangas especiales
    edicion_especial: Boolean,
    
    contenido_extra: [String], // Ej: ["poster", "postcards", "bookmark"]
    
    portada_alternativa: Boolean
  })
);

// 3. Esquema para ROPA
export const RopaModel = ProductModel.discriminator("Ropa",
  new mongoose.Schema({
    // Atributos específicos de ropa
    tipo_prenda: {
      type: String,
      enum: ["camiseta", "sudadera", "hoodie", "pantalon", "shorts", "vestido", "chaqueta", "accesorio_ropa"],
      required: true
    },
    
    tallas: [{
      talla: {
        type: String,
        required: true
      }, // Ej: "S", "M", "L", "XL"
      stock: {
        type: Number,
        default: 0,
        min: 0
      }
    }],
    
    colores: [{
      nombre: String,
      codigo_hex: String,
      imagenes: [String]
    }],
    
    material: {
      type: [String],
      required: true
    }, // Ej: ["algodón", "poliéster"]
    
    composicion: String, // Ej: "100% algodón"
    
    genero: {
      type: String,
      enum: ["hombre", "mujer", "unisex", "niño", "niña"],
      default: "unisex"
    },
    
    temporada: {
      type: String,
      enum: ["primavera", "verano", "otoño", "invierno", "todas"]
    },
    
    cuidado_ropa: String,
    
    diseño: {
      type: String,
      enum: ["estampar_frontal", "estampar_trasero", "estampar_completa", "bordado", "sublimado"]
    },
    
    modelo_ajuste: {
      type: String,
      enum: ["regular", "slim", "oversize", "relaxed"]
    }
  })
);

// 4. Esquema para ACCESORIOS
export const AccesorioModel = ProductModel.discriminator("Accesorio",
  new mongoose.Schema({
    // Atributos específicos de accesorios
    tipo_accesorio: {
      type: String,
      enum: [
        "llavero", "pin", "poster", "pegatina", "taza", 
        "almohada", "fundas", "joyeria", "bolsos", 
        "llavero", "otros"
      ],
      required: true
    },
    
    material: {
      type: [String],
      required: true
    },
    
    dimensiones: {
      alto: Number, // cm
      ancho: Number, // cm
      profundidad: Number // cm
    },
    
    peso_gr: Number,
    
    uso: String, // Ej: "decoración", "uso diario", "colección"
    
    compatibilidad: String, // Para accesorios específicos
    
    // Específicos para tipos de accesorios
    capacidad_ml: Number, // Para tazas
    
    tipo_relleno: String, // Para almohadas
    
    tipo_papel: String, // Para posters
    
    resistencia_agua: Boolean, // Para pegatinas
    
    // Para llaveros y pines
    tipo_cierre: {
      type: String,
      enum: ["anilla", "clip", "imán", "otros"]
    }
  })
);

export default ProductModel;