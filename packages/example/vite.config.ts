import { defineConfig } from 'vite'
import mcpPlugin from '../plugin/src/index'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    //@ts-ignore
    mcpPlugin({
      server: './src/server.js',
      dirs: [
        { dir: './src/calculadora' }
      ],
    })
  ],
})
