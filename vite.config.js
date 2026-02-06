import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true,   // 👈 REQUIRED
    port: 5173    // (optional but recommended)
  }
})
