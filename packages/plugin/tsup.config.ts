import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  sourcemap: false,
  bundle: true,
  splitting: true,
  treeshake: false,
  external: [
    "glob",
    "vite",
    "express",
    "path"
  ]
})
