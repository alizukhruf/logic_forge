import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'desktop' ? './' : '/',
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    historyApiFallback: true,
    watch: {
      ignored: ['**/release/**'],
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor'
          if (id.includes('/node_modules/@supabase/')) return 'supabase-vendor'
          if (id.includes('/node_modules/framer-motion/')) return 'motion-vendor'
        },
      },
    },
  },
}))
