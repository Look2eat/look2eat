-- CreateTable
CREATE TABLE "WhatsAppCycle" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "creditsCharged" INTEGER NOT NULL DEFAULT 2,
    "purchaseMessageSent" BOOLEAN NOT NULL DEFAULT false,
    "reminder1Sent" BOOLEAN NOT NULL DEFAULT false,
    "reminder1SentAt" TIMESTAMP(3),
    "reminder2Sent" BOOLEAN NOT NULL DEFAULT false,
    "reminder2SentAt" TIMESTAMP(3),
    "expirySent" BOOLEAN NOT NULL DEFAULT false,
    "expirySentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppCycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppCycle_transactionId_key" ON "WhatsAppCycle"("transactionId");

-- CreateIndex
CREATE INDEX "WhatsAppCycle_reminder1Sent_createdAt_idx" ON "WhatsAppCycle"("reminder1Sent", "createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppCycle_reminder2Sent_createdAt_idx" ON "WhatsAppCycle"("reminder2Sent", "createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppCycle_expirySent_createdAt_idx" ON "WhatsAppCycle"("expirySent", "createdAt");

-- AddForeignKey
ALTER TABLE "WhatsAppCycle" ADD CONSTRAINT "WhatsAppCycle_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
