import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy /api/* requests to the Spring Boot backend during development.
    // This means the browser only sees one origin (localhost:5173) so there
    // is no CORS preflight from the browser side. The backend CorsConfig is
    // still in place as a safety net for direct / non-proxied calls.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
