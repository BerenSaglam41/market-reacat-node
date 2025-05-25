import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    cors: true
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: false,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Vercel için sourcemap'i kapat
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', 'react-redux', '@reduxjs/toolkit']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  // Vercel için özel ayarlar
  base: '/',
  publicDir: 'public'
})