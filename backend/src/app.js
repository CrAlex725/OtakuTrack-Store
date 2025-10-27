import express from "express"; // Crea el Servidor y Maneja las rutas 
import cors from "cors"; //Permite al frontend (React) hacer peticiones desde otro puerto
import productRoutes from "./routes/ProductRoutes.js"; //importa products de la carpeta routes
import categoryRoutes from "./routes/CategoryRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import dotenv from dotenv;
dotenv.config(); // lee configuraciones de .env en la raiz

const app = express(); // Escucha peticiones HTTP y envía respuestas

app.use(cors({
  origin: true, // tu frontend
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
})); // si no está las peticiones se bloquearían por el navegador
app.use(express.json()) // hace que el servidor entienda datos .JSON

//Rutas
app.use('/api/products', productRoutes); //Activamos la ruta de productos
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes)

app.get('/api/health', (req, res) => res.json({
    status:'OK', message: 'Servidor funcionando'}));

app.get('/', (req,res) => {
    res.json({message: 'Api de OtakuTrack Funcionando'});
});

module.exports = app;