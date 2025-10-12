const express = require('express'); // Crea el Servidor y Maneja las rutas 
const cors = require('cors'); //Permite al frontend (React) hacer peticiones desde otro puerto
const mongoose = require('mongoose'); // Conecta con MongoDB (base de datos)
const productRoutes = require('./routes/productsRoutes'); //importa products de la carpeta routes
require('dotenv').config(); // lee configuraciones de .env en la raiz

const app = express(); // Escucha peticiones HTTP y envía respuestas
app.use(cors()) // si no está las peticiones se bloquearían por el navegador
app.use(express.json()) // hace que el servidor entienda datos .JOSN
app.use('/api/productos', productRoutes); //Activamos la ruta de productos

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

app.get('/api/health', (req, res) => res.json({status:'OK'}));
/* app.get: define la ruta correspondiente a peticiones GET (GET, POST, PUT, DELETE)
'/api/health': URL a visitar
(req, res) =>: funcion que se ejecuta al recibir la peticion
res.json({...}) responde con un objeto convertido a JSON
*/

//Conexion a la base de datos
mongoose
    .connect(MONGO_URI)// Promesa de conexion
    .then((/*resultado positivo de la conexion*/) => console.log('✅ Conectado a MongoDB correctamente'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

app.listen(PORT, () => {
    console.log('Backend listening on', PORT)
});
//