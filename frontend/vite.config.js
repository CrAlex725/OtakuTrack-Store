import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true,
        secure: false,
        // eslint-disable-next-line no-unused-vars
        configure: (proxy, _options) => {
          // eslint-disable-next-line no-unused-vars
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          // eslint-disable-next-line no-unused-vars
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 Sending Request to the Target:', req.method, req.url);
          });
          // eslint-disable-next-line no-unused-vars
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})