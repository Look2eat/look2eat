/*
  Warnings:

  - A unique constraint covering the columns `[brandId,coinsRequired]` on the table `RewardMilestone` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CreditTransaction_outletId_idx";

-- DropIndex
DROP INDEX "OutletSubscription_outletId_idx";

-- CreateIndex
CREATE INDEX "CoinWallet_expiryDate_idx" ON "CoinWallet"("expiryDate");

-- CreateIndex
CREATE INDEX "CreditTransaction_outletId_createdAt_idx" ON "CreditTransaction"("outletId", "createdAt");

-- CreateIndex
CREATE INDEX "OutletSubscription_outletId_isActive_idx" ON "OutletSubscription"("outletId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RewardMilestone_brandId_coinsRequired_key" ON "RewardMilestone"("brandId", "coinsRequired");

-- AddForeignKey
ALTER TABLE "CustomerOTPSession" ADD CONSTRAINT "CustomerOTPSession_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "RewardMilestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
