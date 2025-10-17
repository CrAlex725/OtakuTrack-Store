import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,           // 👈 Aquí estableces el nuevo puerto
    open: true,           // abre automáticamente el navegador
    host: true            // permite acceso desde Docker o LAN si es necesario
  }
})
