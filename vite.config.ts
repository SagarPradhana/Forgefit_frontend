import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://gymmanagement-backend-1wvo.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: "auto",
      includeAssets: ['favicon.svg', 'icons.svg', 'robots.txt', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      devOptions: {
        enabled: true,
      },

      manifest: {
        name: 'ForgeFit Gym Management',
        short_name: 'ForgeFit',
        start_url: '/',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#6366f1',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
