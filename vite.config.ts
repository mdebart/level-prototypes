import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the build works on GitHub Pages
// (username.github.io/level-prototypes/) and any other static host.
export default defineConfig({
  plugins: [react()],
  base: './',
})
