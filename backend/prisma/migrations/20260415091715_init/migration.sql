/*
  Warnings:

  - You are about to drop the column `settingsId` on the `Brand` table. All the data in the column will be lost.
  - The `status` column on the `WhatsAppMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `AdminUser` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'REDEMPTION');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'FAILED_INVALID_NUMBER');

-- DropForeignKey
ALTER TABLE "AdminUser" DROP CONSTRAINT "AdminUser_brandId_fkey";

-- AlterTable
ALTER TABLE "AdminUser" ALTER COLUMN "brandId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "settingsId";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "WhatsAppMessage" DROP COLUMN "status",
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_brandId_status_idx" ON "WhatsAppMessage"("brandId", "status");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_phoneNumber_status_idx" ON "WhatsAppMessage"("phoneNumber", "status");

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
