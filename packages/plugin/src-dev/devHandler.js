import express from "express"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import createInstance from "@mcp/createInstance.js"
import cors from 'cors';
import { randomUUID } from 'node:crypto';

export const handler = express();
handler.use(express.json());
handler.use(cors());

const transports = new Map();

handler.all('/', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];

    let transport = sessionId ? transports.get(sessionId) : undefined;

    if (!transport) {
        const server = await createInstance();
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            // eventStore,
            retryInterval: 2000,
            onsessioninitialized: id => {
                console.log(`[${id}] Session initialized`);
                transports.set(id, transport);
            }
        });
        await server.connect(transport);
    }
    await transport.handleRequest(req, res, req.body);
});

