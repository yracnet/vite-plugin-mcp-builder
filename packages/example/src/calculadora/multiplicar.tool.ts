import { z } from "zod";
import { defineRegisterTool } from "vite-plugin-mcp-builder/define";


export default defineRegisterTool("multiplicar",
    {
        title: "Multiplicar dos números",
        description: "Esta herramienta multiplica dos números dados como entrada.",
        inputSchema: {
            number1: z.number(),
            number2: z.number(),
        }
    },
    async ({ number1, number2 }: any) => {
        if (typeof number1 !== 'number' || typeof number2 !== 'number') {
            throw new Error("Los parámetros deben ser números.");
        }
        return {
            content: [
                {
                    type: "text",
                    text: (number1 * number2).toString()
                }
            ]
        }
    }
)
