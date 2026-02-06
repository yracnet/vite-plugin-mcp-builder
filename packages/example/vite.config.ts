import { defineConfig } from 'vite'
import mcpPlugin from '../plugin/src/index'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@mcp/define': path.resolve('../plugin/src/define.ts')
    }
  },
  plugins: [
    //@ts-ignore
    mcpPlugin({
      dirs: [
        {
          dir: './src/calculadora',
        }
      ]
    })
  ],
})
