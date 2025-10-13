const express = require('express'); // Crea el Servidor y Maneja las rutas 
const cors = require('cors'); //Permite al frontend (React) hacer peticiones desde otro puerto
const connectDB = require('./config/db'); // Conecta al archivo db.js
const productRoutes = require('./routes/productsRoutes'); //importa products de la carpeta routes
require('dotenv').config(); // lee configuraciones de .env en la raiz

const app = express(); // Escucha peticiones HTTP y envía respuestas
app.use(cors()) // si no está las peticiones se bloquearían por el navegador
app.use(express.json()) // hace que el servidor entienda datos .JSON
app.use('/api/products', productRoutes); //Activamos la ruta de productos

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

app.get('/api/health', (req, res) => res.json({status:'OK'}));

//Conexion a la base de datos
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`BACKEND LISTENING ON PORT http://localhost:${PORT}`);
    });
});
//