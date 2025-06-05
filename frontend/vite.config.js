// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ← Add these two imports:
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      // Make sure these paths match where mkcert dumped your certs
      key:  fs.readFileSync(path.resolve(__dirname, "certs/localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.pem")),
    },
    port: 5173,
    proxy: {
      // forward any /api/* calls to your backend at :8080
      '/api': {
        target: 'https://localhost:8443',
        changeOrigin: true,
        secure: false, // no need to validate SSL on the backend
      },
    },
  },
});