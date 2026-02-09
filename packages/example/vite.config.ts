import { defineConfig } from 'vite'
import { mcpPlugin } from 'vite-plugin-mcp-builder'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mcpPlugin({
      server: './src/server.js',
      dirs: [
        { dir: './src/calculadora' }
      ],
    })
  ],
})
