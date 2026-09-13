import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ ... })
  ],
  build: {
    cssMinify: false
  },
  server: {
    proxy: {
      '/auth': 'https://skalmansfoodsleepclock.onrender.com',
      '/api': 'https://skalmansfoodsleepclock.onrender.com'
    }
  }
});