-- AlterTable
ALTER TABLE "Outlet" ADD COLUMN     "googleReviewUrl" TEXT,
ADD COLUMN     "managerWhatsappNumber" TEXT;

-- CreateTable
CREATE TABLE "CustomerFeedback" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "ownerNotified" BOOLEAN NOT NULL DEFAULT false,
    "ownerNotifiedAt" TIMESTAMP(3),
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerFeedback_transactionId_key" ON "CustomerFeedback"("transactionId");

-- CreateIndex
CREATE INDEX "CustomerFeedback_outletId_rating_idx" ON "CustomerFeedback"("outletId", "rating");

-- CreateIndex
CREATE INDEX "CustomerFeedback_brandId_idx" ON "CustomerFeedback"("brandId");

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
