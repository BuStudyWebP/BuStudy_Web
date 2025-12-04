import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/BuStudy_Web/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'BuStudy',
        short_name: 'BuStudy',
        description: '버스 타는 시간을 공부 시간으로! AI가 출제하는 통학 맞춤형 퀴즈',
        theme_color: '#fb923c',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/BuStudy_Web/',
        start_url: '/BuStudy_Web/',
        icons: [
          {
            src: 'assets/logo/BuStudy.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ],
})
