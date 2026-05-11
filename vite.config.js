import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables from project root
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Frontend root
    root: 'client',

    // Correct env location (project root)
    envDir: '.',

    plugins: [
      react(),
      tailwindcss()
    ],

    build: {
      // Output build to root dist folder
      outDir: '../dist',

      // Clean old build
      emptyOutDir: true,

      // Better chunk splitting
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth'],
            charts: ['recharts'],
            animations: ['gsap', 'framer-motion'],
            maps: ['leaflet', 'react-leaflet']
          }
        }
      }
    },

    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './client/src'),
      },
    },

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(
        env.GEMINI_API_KEY
      ),
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});