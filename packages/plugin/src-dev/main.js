import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import createInstance from "@mcp/createInstance.js"

const server = await createInstance();
const transport = new StdioServerTransport();
await server.connect(transport);