import type { PluginConf } from "./model";
import fs from "fs";
import path from "path";
import { glob } from "glob";

export const writeCreateInstance = async (conf: PluginConf) => {
    const defineDir = path.dirname(conf.createInstanceFile);
    const importFiles = conf.dirs
        .map((it) => glob
            .globSync(it.include, {
                cwd: it.dir,
                nodir: false,
            })
            .map(file => path.join(it.dir, file))
        )
        .flat()
        .map((file) => path.relative(defineDir, file).replaceAll('\\', '/'))
        .map((file, ix) => ({ importFile: `./${file}`, name: `define${ix}` }));
    const defineContent = `// Generate at: ${new Date()}
import createServer from '${conf.moduleId}/createServer.js';
${importFiles.map((it) => `import ${it.name} from '${it.importFile}';`).join('\n')}

export default async ()=>{
    const server = await createServer();
${importFiles.map((it) => `    ${it.name}(server);`).join('\n')}
    return server;
};
`;
    fs.mkdirSync(defineDir, { recursive: true })
    fs.writeFileSync(conf.createInstanceFile, defineContent + "\n");
}