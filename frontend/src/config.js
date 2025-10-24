const config = {
  // En desarrollo, usamos el proxy de Vite
  // En producción, la API estará en el mismo dominio o uno configurado
  apiBaseUrl: import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL || '/api'
    : '/api'
};

export default config;