# Imagen base de Node.js
FROM node:18

# Crear carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos del backend
COPY package*.json ./
RUN npm install

# Copiar el resto del código del backend
COPY src/ ./src/

# Exponer el puerto del backend
EXPOSE 3001

# Comando por defecto para ejecutar la app
CMD ["node", "src/server.js"]
