-- Remove temporary foreign key constraint if it exists
ALTER TABLE "Brand" DROP COLUMN IF EXISTS "settingsId";

-- AlterTable: Update Cashier model
-- Replace tempPassword with passwordHash
ALTER TABLE "Cashier" DROP COLUMN IF EXISTS "tempPassword";
ALTER TABLE "Cashier" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT 'temp_hash_placeholder';

-- Update the default to empty string for new values, then mark as NOT NULL
ALTER TABLE "Cashier" ALTER COLUMN "passwordHash" DROP DEFAULT;

-- CreateTable for CustomerOTPSession
CREATE TABLE "CustomerOTPSession" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerOTPSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for CustomerOTPSession
CREATE INDEX "CustomerOTPSession_brandId_phoneNumber_verified_idx" ON "CustomerOTPSession"("brandId", "phoneNumber", "verified");
