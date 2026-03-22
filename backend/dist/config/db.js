"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
exports.closeDb = closeDb;
const client_1 = require("../prisma/client");
async function initDb() {
    try {
        await client_1.prisma.$connect();
        console.log("✅ Prisma connected");
    }
    catch (error) {
        console.error("❌ Prisma connection error:", error);
        throw error;
    }
}
async function closeDb() {
    try {
        await client_1.prisma.$disconnect();
        console.log("✅ Prisma disconnected");
    }
    catch (error) {
        console.error("❌ Error disconnecting Prisma:", error);
    }
}
