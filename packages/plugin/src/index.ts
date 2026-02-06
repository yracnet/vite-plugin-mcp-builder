import type { Plugin } from "vite";
import express from "express";
import { assertConfig, type PluginOpts } from "./model";
import { writeCreateInstance } from "./createInstanceFile";

export const mcpPlugin = (opts: PluginOpts): Plugin => {
  const conf = assertConfig(opts);
  writeCreateInstance(conf);

  const isReload = (file: string) => {
    return conf.hmrDirs.find((it) => file.startsWith(it));
  };
  return {
    name: "vite-plugin-mcp-build",
    enforce: "pre",
    apply: "serve",
    config: () => {
      return {
        server: {
          cors: true
        },
        resolve: {
          alias: {
            [`${conf.moduleId}/main.js`]: conf.mainFile,
            [`${conf.moduleId}/createServer.js`]: conf.serverFile,
            [`${conf.moduleId}/createInstance.js`]: conf.createInstanceFile,
          },
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
      const instace = {
        version: 1,
        forceReload: false,
        handler: (_: any, __: any, next: any) => {
          console.log("Handler Default!");
          next("Not loading");
        },
        invalidateSessions: () => {
          console.log("InvalidateSessions Default!");
        }
      }


      const onReload = async (file: string) => {
        if (isReload(file)) {
          writeCreateInstance(conf);
          instace.version++;
          instace.forceReload = true;
          // watcher.off("all", onReload);
          // console.log("Reload devHandlerFile!");
          // const mod = await ssrLoadModule(conf.devHandlerFile, {
          //   fixStacktrace: true,
          // });
          // instace.date = new Date();
          // instace.handler = mod.handler;
        }
      };
      watcher.on("all", (_, file) => onReload(file));
      console.log("Load devHandlerFile!");
      const mod = await ssrLoadModule(conf.devHandlerFile, {
        fixStacktrace: true,
      });
      instace.handler = mod.handler;
      instace.invalidateSessions = mod.invalidateSessions;

      appServer.use("/", async (req, res, next) => {
        console.log("Request: ", instace.version, instace.forceReload);
        if (instace.forceReload) {
          instace.invalidateSessions();
          instace.forceReload = false;
        }
        try {
          instace.handler(req, res, next);
        } catch (error) {
          ssrFixStacktrace(error as Error);
          process.exitCode = 1;
          next(error);
        }
      });
      middlewares.use("/mcp", appServer);
    },
  };
};


export default mcpPlugin;