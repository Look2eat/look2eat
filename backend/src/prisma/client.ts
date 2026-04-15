import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { WebSocket } from "ws";

declare global {
  var __prismaClient__: PrismaClient | undefined;
}

neonConfig.webSocketConstructor = WebSocket;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}
console.log('DATABASE_URL in prisma client:', connectionString.substring(0, 50) + '...');
const adapter = new PrismaNeon({ connectionString });

export const prisma =
  globalThis.__prismaClient__ ??
  new PrismaClient({
    adapter,
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaClient__ = prisma;
}