import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            maximumFileSizeToCacheInBytes: 5000000, // 5MB
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/api\.aladhan\.com\/v1\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'aladhan-api-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'alquran-api-cache',
                  expiration: {
                    maxEntries: 200,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/.*\.mp3quran\.net\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'mp3quran-audio-cache',
                  expiration: {
                    maxEntries: 50, // Cache up to 50 audio files
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/cdn\.islamic\.network\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'islamic-network-audio-cache',
                  expiration: {
                    maxEntries: 50, // Cache up to 50 audio files
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          },
          manifest: {
            name: 'Sabildeen Islamic Companion',
            short_name: 'Sabildeen',
            description: 'Islamic companion app with Quran, Hadith, Prayer times and more.',
            theme_color: '#10b981',
            background_color: '#f8fafc',
            display: 'standalone',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
