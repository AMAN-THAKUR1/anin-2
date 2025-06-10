import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'simple-peer': 'simple-peer/simplepeer.min.js'
    }
  },
  server: {
    host: '0.0.0.0',    // This makes the server accessible to your network
    port: 5173,    // You can change this port if needed
  }
})
