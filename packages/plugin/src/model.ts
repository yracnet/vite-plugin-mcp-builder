import path from "path";
import { fileURLToPath } from "url";

const getPluginDir = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Retroceder desde src o dist hasta la raiz del plugin
    return path.resolve(__dirname, "..", "src-dev");
};

export type PluginOpts = {
    root?: string;
    cacheDir?: string;
    server?: string;
    devHandler: string;
    main?: string;
    include?: string[];
    dirs?: {
        dir: string,
        include?: string[];
        skip?: boolean
    }[];
};

export type PluginConf = {
    moduleId: string;
    serverFile: string;
    createInstanceFile: string;
    devHandlerFile: string;
    mainFile: string;
    dirs: {
        dir: string,
        include: string[];
    }[];
    hmrDirs: string[];
};

export const assertConfig = (opts: PluginOpts): PluginConf => {
    const pluginDir = getPluginDir();
    const {
        root = process.cwd(),
        cacheDir = '.mcp',
    } = opts;

    const {
        server = path.join(pluginDir, "createServer.js"),
        main = path.join(pluginDir, "main.js"),
        devHandler = path.join(pluginDir, "devHandler.js"),
        include = [
            "**/*.tool.ts",
            "**/*.promt.ts",
            "**/*.resource.ts",
            "**/*.tool.js",
            "**/*.promt.js",
            "**/*.resource.js",
        ],
        dirs = [
            { dir: "src", include: [], skip: false }
        ],
    } = opts;
    const allowDirs = dirs.filter(it => !it.skip);
    return {
        moduleId: "@mcp",
        serverFile: path.resolve(root, server),
        createInstanceFile: path.resolve(root, cacheDir, "createInstance.js"),
        devHandlerFile: path.resolve(root, devHandler),
        mainFile: path.resolve(root, main),
        dirs: allowDirs.map((it) => {
            return {
                dir: path.resolve(root, it.dir),
                include: it.include ?? include,
            };
        }),
        hmrDirs: allowDirs.map((it) => path.resolve(root, it.dir)),
    };
};