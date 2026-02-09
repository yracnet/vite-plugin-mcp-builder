import express from "express"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import createInstance from "@mcp/createInstance.js"
import cors from 'cors';
import { randomUUID } from 'node:crypto';

export const createHandler = async ({
    stateless = true
}) => {
    const handler = express();
    handler.use(express.json());
    handler.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'mcp-session-id', 'Last-Event-ID', 'mcp-protocol-version'],
        exposedHeaders: ['mcp-session-id', 'mcp-protocol-version']
    }));

    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: stateless ? undefined : randomUUID,
        retryInterval: 2000,
    });
    const server = await createInstance();
    server.connect(transport);

    handler.all('/', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'];
        console.log(`\n${req.method} ${req.originalUrl}`, req.body, sessionId);
        await transport.handleRequest(req, res, req.body);
    });
    return handler;
}

