import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
            },
            {
              name: 'state-vendor',
              test: /[\\/]node_modules[\\/](@reduxjs[\\/]toolkit|react-redux|axios|immer)[\\/]/,
            },
            {
              name: 'clerk-vendor',
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
            },
            {
              name: 'icons-vendor',
              test: /[\\/]node_modules[\\/]@remixicon[\\/]/,
            },
          ],
        },
      },
    },
  },
})
