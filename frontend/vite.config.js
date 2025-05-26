// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // catch /api/* on 5173 and forward to /* on 8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
    },
  },
})