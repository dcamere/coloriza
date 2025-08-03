import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/coloriza/' : '/',
  css: {
    preprocessorOptions: {
      scss: {
        // Options for Sass here
      },
    },
  },
})
