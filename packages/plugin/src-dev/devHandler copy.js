import express from "express"
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import register from "@mcp/register.js"

export const handler = express();

handler.use(express.json());

// const transports = {};

// handler.post("/", async (req, res) => {
//     console.log(">>>>>", req.body);
//     try {
//         const sessionIdHeader = req.headers["mcp-session-id"];
//         let transport = sessionIdHeader && transports[sessionIdHeader];
//         if (!transport) {
//             const newSessionId = randomUUID();
//             transport = new StreamableHTTPServerTransport({
//                 sessionIdGenerator: () => newSessionId
//             });
//             try {
//                 await register.connect(transport);
//             } catch (error) {
//                 console.error("Error connecting register to transport:", error);
//             }
//             transports[newSessionId] = transport;
//             res.setHeader("Mcp-Session-Id", newSessionId);
//         }
//         await transport.handleRequest(req, res, req.body);
//     } catch (error) {
//         console.error("Error in POST handler:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// handler.get("/", async (req, res) => {
//     try {
//         const sessionId = req.headers["mcp-session-id"];
//         const transport = sessionId && transports[sessionId];
//         if (transport) {
//             await transport.handleRequest(req, res);
//         } else {
//             res.status(404).json({ error: "Session not found" });
//         }
//     } catch (error) {
//         console.error("Error in GET handler:", error);
//         res.status(500).json({ error: error.message });
//     }
// });



const devTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => "01"
});
await register.connect(devTransport);

handler.post("/", async (req, res) => {
    console.log(">>>>>", req.body);
    try {
        await devTransport.handleRequest(req, res, req.body);
    } catch (error) {
        console.log("Error in POST handler:", error);
        res.status(500).json({ error: error.message });
    }
});

handler.get("/", async (req, res) => {
    try {
        await devTransport.handleRequest(req, res);
    } catch (error) {
        console.log("Error in GET handler:", error);
        res.status(500).json({ error: error.message });
    }
});



