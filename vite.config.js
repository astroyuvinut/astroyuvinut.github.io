import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // served from https://astroyuvinut.github.io/ (user site, root)
  base: '/',
  plugins: [react()],
})
