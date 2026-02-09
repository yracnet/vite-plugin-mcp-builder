import type { Plugin } from "vite";
import express from "express";
import { assertConfig, type PluginOpts } from "./model";
import { writeCreateInstance } from "./createInstanceFile";

export const mcpPlugin = (opts: PluginOpts): Plugin[] => {
  const conf = assertConfig(opts);
  writeCreateInstance(conf);

  const isReload = (file: string) => {
    return conf.hmrDirs.find((it) => file.startsWith(it));
  };
  return [
    {
      name: "vite-plugin-mcp-alias",
      enforce: "pre",
      config: () => {
        return {
          resolve: {
            alias: {
              [`${conf.moduleId}/main.js`]: conf.mainFile,
              [`${conf.moduleId}/createServer.js`]: conf.serverFile,
              [`${conf.moduleId}/createInstance.js`]: conf.createInstanceFile,
            },
          },
        };
      },
    },
    {
      name: "vite-plugin-mcp-server",
      enforce: "pre",
      apply: "serve",
      config: () => {
        return {
          appType: "custom",
          server: {
            cors: true
          },
        };
      },
      configureServer: async (devServer) => {
        const {
          //
          watcher,
          restart,
          middlewares,
          ssrLoadModule,
          ssrFixStacktrace,
        } = devServer;
        var appServer = express();
        const onReload = async (file: string) => {
          if (isReload(file)) {
            writeCreateInstance(conf);
            restart();
          }
        };
        watcher.on("all", (_, file) => onReload(file));
        console.log("Load devHandler!");
        const { createHandler } = await ssrLoadModule(conf.devHandlerFile, {
          fixStacktrace: true,
        });
        const handler = await createHandler({});
        appServer.use("/", async (req, res, next) => {
          try {
            handler(req, res, next);
          } catch (error) {
            ssrFixStacktrace(error as Error);
            process.exitCode = 1;
            next(error);
          }
        });
        middlewares.use("/mcp", appServer);
      },
    },
    {
      name: "vite-plugin-mcp-build",
      enforce: "pre",
      apply: "build",
      config: () => {
        return {
          appType: "custom",
          target: "esnext",
          emptyOutDir: true,
          build: {
            ssr: conf.mainFile,
            rollupOptions: {
              output: {
                format: "es",
                entryFileNames: "app.js",
                chunkFileNames: "bin/[name].js",
                assetFileNames: "assets/[name].[ext]"
              }
            }
          }
        };
      },
    }

  ];
};


export default mcpPlugin;