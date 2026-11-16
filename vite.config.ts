import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'امداد یار — همراه دقایق طلایی',
        short_name: 'امداد یار',
        description: 'راهنمای گام‌به‌گام کمک‌های اولیه، شماره‌های اضطراری و درخواست امداد',
        lang: 'fa',
        dir: 'rtl',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f3f5f8',
        theme_color: '#ffffff',
        start_url: './',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
