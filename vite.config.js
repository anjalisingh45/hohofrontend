import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ Important for Vercel
  build: {
    outDir: 'dist', // ✅ Matches your build output
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true, // ✅ SPA routing support
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
