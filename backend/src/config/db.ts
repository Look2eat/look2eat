import { prisma } from "../prisma/client";

export async function initDb(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected");
  } catch (error) {
    console.error("❌ Prisma connection error:", error);
    throw error;
  }
}

export async function closeDb(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting Prisma:", error);
  }
}