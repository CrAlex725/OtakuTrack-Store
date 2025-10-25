const express = require('express'); // Crea el Servidor y Maneja las rutas 
const cors = require('cors'); //Permite al frontend (React) hacer peticiones desde otro puerto
const productRoutes = require('./routes/ProductRoutes'); //importa products de la carpeta routes
const categoryRoutes = require('./routes/CategoryRoutes');
require('dotenv').config(); // lee configuraciones de .env en la raiz

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

app.get('/api/health', (req, res) => res.json({
    status:'OK', message: 'Servidor funcionando'}));

app.get('/', (req,res) => {
    res.json({message: 'Api de OtakuTrack Funcionando'});
});

module.exports = app;