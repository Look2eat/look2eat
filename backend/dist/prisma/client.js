"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_neon_1 = require("@prisma/adapter-neon");
const serverless_1 = require("@neondatabase/serverless");
const ws_1 = require("ws");
const env_1 = require("../config/env");
serverless_1.neonConfig.webSocketConstructor = ws_1.WebSocket;
const adapter = new adapter_neon_1.PrismaNeon({
    connectionString: env_1.env.databaseUrl,
});
exports.prisma = globalThis.__prismaClient__ ??
    new client_1.PrismaClient({
        adapter,
        log: env_1.env.nodeEnv === "development"
            ? ["query", "warn", "error"]
            : ["warn", "error"],
    });
if (env_1.env.nodeEnv !== "production") {
    globalThis.__prismaClient__ = exports.prisma;
}
