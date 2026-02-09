import { defineRegisterResourceV2 } from "mcp-define";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export default defineRegisterResourceV2(
    "saludar",
    new ResourceTemplate("saludar://{nombre}", { list: undefined }),
    {
    },
    async (url, { nombre }) => {
        if (typeof nombre !== 'string') {
            throw new Error("El parámetro nombre debe ser una cadena de texto.");
        }
        return {
            contents: [
                {
                    type: "text",
                    uri: url.href,
                    text: `Hola ${nombre}! Como estas.... este un HOt change`
                }
            ]
        };
    }
)
