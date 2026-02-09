# Vite Plugin: MCP Build

This Vite plugin helps develop and build Model Context Protocol (MCP) handlers.

Key features:

- Development server that mounts an MCP handler under `/mcp`.
- Production build that produces a single bundle at `dist/app.js`.
- Scans configured directories for `*.tool`, `*.prompt` and `*.resource` files to include in the bundle.

## Overview

The plugin scans the project files defined by the `dirs` option and exposes a development endpoint at `/mcp` that serves those definitions dynamically. For production it bundles the detected definitions into a single output file `dist/app.js`.

## Installation

Install with your package manager:

```bash
yarn add -D vite-plugin-mcp-builder
# or
npm install -D vite-plugin-mcp-builder
```

## Usage (example `vite.config.ts`)

```ts
import { defineConfig } from 'vite'
import mcpPlugin from 'vite-plugin-mcp-builder'

export default defineConfig({
  plugins: [
    mcpPlugin({
      // optional plugin properties shown below
      server: './src/createServer.js',
      main: './src/main.js',
      dirs: [
        { dir: './src/calculadora' }
      ]
    })
  ]
})
```

## Plugin options

All options are optional. Defaults are shown where applicable.

- `root?: string` — Project root used to resolve relative paths. Defaults to `process.cwd()`.
- `cacheDir?: string` — Directory where generated helper files are written (e.g. `createInstance.js`). Default: `.mcp`.
- `server?: string` — Path to the server factory module used in production. Default: internal `src-dev/createServer.js` (resolved relative to `root`).
- `devHandler?: string` — Path to the development handler module used by the Vite dev server. Default: internal `src-dev/devHandler.js` (resolved relative to `root`).
- `main?: string` — The main production entry module used for SSR build. Default: internal `src-dev/main.js` (resolved relative to `root`).
- `include?: string[]` — Glob patterns used to match tool/prompt/resource files inside each `dirs` entry. Default patterns (the plugin supports both `.ts` and `.js`):

  ```
  [
    "**/*.tool.ts",
    "**/*.prompt.ts",
    "**/*.resource.ts",
    "**/*.tool.js",
    "**/*.prompt.js",
    "**/*.resource.js"
  ]
  ```

  Note: the original source contained a typo (`promt`). The plugin's intended pattern is `prompt`.

- `dirs?: { dir: string; include?: string[]; skip?: boolean }[]` — Array of directories to scan. Each entry:
  - `dir` (required): directory path (relative to `root`) to scan.
  - `include` (optional): per-dir globs overriding the global `include` list.
  - `skip` (optional): if `true` the directory is ignored.

  Default: `[{ dir: 'src', include: [], skip: false }]` — the plugin will scan `src` by default.

## Development mode

Run Vite in dev mode (e.g. `yarn dev`). The plugin configures the dev server and mounts the MCP handler under `/mcp` (the path is registered by the plugin's middleware).

By default Vite's dev server will include the plugin's middleware under the `/mcp` route. Example local URL:

```
http://localhost:5173/mcp
```

Register this URL in your agent during development, e.g.:

```json
{
  "servers": {
    "my-mcp-dev": {
      "type": "http",
      "url": "http://localhost:5173/mcp"
    }
  }
}
```

## Production build

Run your normal Vite build (e.g. `yarn build`). The plugin configures the build to produce a single SSR entry output named `app.js` (written under the `dist` directory by default). That file is suitable to load in a production process that creates the server instance and starts transports.

Example `main.js` (production runner):

```ts
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import createInstance from "@mcp/createInstance.js";

const server = await createInstance();
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Defining tools, prompts and resources

Install `mcp-define` for help definition:

```bash
yarn add -D mcp-define
# or
npm install -D mcp-define
```

Tools, prompts and resources are defined with the helper registrations (see `mcp-define` library). Typical usage registers a tool with a title, description, input schema and an implementation function. Example (TypeScript):

```ts
import { z } from 'zod';
import { defineRegisterTool } from 'mcp-define';

export default defineRegisterTool(
  'divide',
  {
    title: 'Divide two numbers',
    description: 'Divides two given numbers.',
    inputSchema: {
      number1: z.number(),
      number2: z.number(),
    },
  },
  async ({ number1, number2 }: any) => {
    if (typeof number1 !== 'number' || typeof number2 !== 'number') {
      throw new Error('Parameters must be numbers.');
    }
    return {
      content: [{ type: 'text', text: String(number1 / number2) }]
    };
  }
);
```

The registration helpers (`defineRegisterTool`, `defineRegisterPrompt`, `defineRegisterResource`) allow describing handlers without requiring a server instance at definition time.

## Example project layout

```bash
packages/example/src/
  server.ts
  calculadora/
    dividir.tool.ts
    multiplicar.tool.ts
    nombre.resource.ts
```

With the configuration above, the plugin will find `dividir.tool.ts`, `multiplicar.tool.ts` and `nombre.resource.ts` and include them in the production bundle.

## Troubleshooting

- If files are not detected, verify your `dirs` entries and `include` globs, and ensure file extensions (`.ts`/`.js`) match your build.
- Inspect Vite's console output for plugin scan and build messages.

---

If you want, I can also add concrete type signatures for the `defineRegister*` helpers and a small example that consumes `dist/app.js` in a production process.

