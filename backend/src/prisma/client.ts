import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { WebSocket } from "ws";

import { env } from "../config/env";

declare global {
  var __prismaClient__: PrismaClient | undefined;
}

neonConfig.webSocketConstructor = WebSocket;

const adapter = new PrismaNeon({
  connectionString: env.databaseUrl,
});

export const prisma =
  globalThis.__prismaClient__ ??
  new PrismaClient({
    adapter,
    log:
      env.nodeEnv === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (env.nodeEnv !== "production") {
  globalThis.__prismaClient__ = prisma;
}