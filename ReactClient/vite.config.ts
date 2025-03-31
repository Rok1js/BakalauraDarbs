import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss(),
    VitePWA({
      // generates 'manifest.webmanifest' file on build
      manifest: {
        'short_name': 'NewsApp',
        'name': 'News App',
        'icons': [
          {
            'src': '/icons/manifest-icon-192.maskable.png',
            'sizes': '192x192',
            'type': 'image/png',
            'purpose': 'any'
          },
          {
            'src': '/icons/manifest-icon-192.maskable.png',
            'sizes': '192x192',
            'type': 'image/png',
            'purpose': 'maskable'
          },
          {
            'src': '/icons/manifest-icon-512.maskable.png',
            'sizes': '512x512',
            'type': 'image/png',
            'purpose': 'any'
          },
          {
            'src': '/icons/manifest-icon-512.maskable.png',
            'sizes': '512x512',
            'type': 'image/png',
            'purpose': 'maskable'
          }
        ],
        'start_url': '/',
        'display': 'standalone',
        'theme_color': '#ffffff',
        'background_color': '#ffffff'
      },
      workbox: {
        // defining cached files formats
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
      }
    })
  ],
})
