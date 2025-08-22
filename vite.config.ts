import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Consente l'accesso da qualsiasi host
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173, // Usa la stessa porta per HMR
    },
    // Disabilita il controllo degli host per sviluppo
    allowedHosts: true,
  },
})
