import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: [
        'coverage/**',
        'dist/**',
        'models/**',
        'node_modules/**',
        'promptkit/**',
        'server/db/migrations/**',
        'server/db/seeds/**',
        'server/index.ts',
        '**/*.config.js',
        '**/knexfile.js',
      ],
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
