import { z } from "zod";
import { defineRegisterTool } from "@mcp/define";


export default defineRegisterTool("dividir",
    {
        title: "dividir dos números",
        description: "Esta herramienta dividir dos números dados como entrada.",
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
                    text: (number1 / number2).toString()
                }
            ]
        }
    }
)
