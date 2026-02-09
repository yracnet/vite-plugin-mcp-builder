import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export default () => {
  const servidor = new McpServer({
    name: "mcp-custom-example",
    version: "1.0.0",
  });
  return servidor;
}

