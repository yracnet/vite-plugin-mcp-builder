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
      // root: process.cwd(),
      // cacheDir: '.mcp',
      server: './src/createServer.js',
      // devHandler: './src/createDevHandler.js',
      main: './src/main-prod.js',
      // include: ['**/*.tool.ts', '**/*.prompt.ts', '**/*.resource.ts'],
      dirs: [
        {
          dir: './src/calculadora',
          // include: ['**/*.tool.ts', '**/*.prompt.ts', '**/*.resource.ts'],
          // skip: false,
        }
      ],
    })
  ],
})
