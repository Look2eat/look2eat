"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_neon_1 = require("@prisma/adapter-neon");
const serverless_1 = require("@neondatabase/serverless");
const ws_1 = require("ws");
serverless_1.neonConfig.webSocketConstructor = ws_1.WebSocket;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
}
console.log('DATABASE_URL in prisma client:', connectionString.substring(0, 50) + '...');
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
exports.prisma = globalThis.__prismaClient__ ??
    new client_1.PrismaClient({
        adapter,
        log: ["query", "warn", "error"],
    });
if (process.env.NODE_ENV !== "production") {
    globalThis.__prismaClient__ = exports.prisma;
}
