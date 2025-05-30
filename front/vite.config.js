import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // Desactiva HMR en producción para evitar el error de WebSocket
      hmr: mode === 'development',
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://balneario-backend.onrender.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
  }
})
