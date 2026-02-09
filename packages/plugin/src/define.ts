import type {
    McpServer,
    ToolCallback,
    ReadResourceCallback,
    ReadResourceTemplateCallback,
    ResourceMetadata,
    ResourceTemplate,
    PromptCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AnySchema, ZodRawShapeCompat } from '@modelcontextprotocol/sdk/server/zod-compat.js';
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
type PromptArgsRawShape = ZodRawShapeCompat;


export function defineRegisterTool<OutputArgs extends ZodRawShapeCompat | AnySchema, InputArgs extends undefined | ZodRawShapeCompat | AnySchema = undefined>(name: string, config: {
    title?: string;
    description?: string;
    inputSchema?: InputArgs;
    outputSchema?: OutputArgs;
    annotations?: ToolAnnotations;
    _meta?: Record<string, unknown>;
}, cb: ToolCallback<InputArgs>) {
    return (server: McpServer) => {
        try {
            console.log("RegisterTool:", name);
            server.registerTool(name, config, cb)
        } catch (error) {
            console.error('RegisterTool:', error);
        }
    };
};

export function defineRegisterPrompt<Args extends PromptArgsRawShape>(name: string, config: {
    title?: string;
    description?: string;
    argsSchema?: Args;
}, cb: PromptCallback<Args>) {
    return (server: McpServer) => {
        try {
            console.log("RegisterPrompt:", name);
            server.registerPrompt(name, config, cb);
        } catch (error) {
            console.error('RegisterPrompt:', error);
        }
    };
}

export function defineRegisterResource(name: string, uriOrTemplate: string, config: ResourceMetadata, readCallback: ReadResourceCallback) {
    return (server: McpServer) => {
        try {
            console.log("RegisterResource:", name);
            server.registerResource(name, uriOrTemplate, config, readCallback);
        } catch (error) {
            console.error('RegisterResource:', error);
        }
    };
}

export function defineRegisterResourceV2(name: string, uriOrTemplate: ResourceTemplate, config: ResourceMetadata, readCallback: ReadResourceTemplateCallback) {
    return (server: McpServer) => {
        try {
            console.log("RegisterResource:", name);
            server.registerResource(name, uriOrTemplate, config, readCallback);
        } catch (error) {
            console.error('RegisterResourceV2:', error);
        }
    };
}
