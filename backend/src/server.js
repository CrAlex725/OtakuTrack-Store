// backend/src/server.js
import dotenv from dotenv
dotenv.config(); 
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3001;

//Conexion a la base de Datos
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('❌ No se pudo iniciar la aplicación:', error);
  process.exit(1);
});