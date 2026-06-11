"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startReminderJob = startReminderJob;
const client_1 = require("../../prisma/client");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
function startReminderJob() {
    const ONE_HOUR = 60 * 60 * 1000;
    setInterval(async () => {
        try {
            await processReminders();
        }
        catch (error) {
            console.error('Error in 22-hour reminder job:', error);
        }
    }, ONE_HOUR);
    processReminders().catch(console.error);
}
async function processReminders() {
    console.log('Running 22-hour reminder job...');
    const now = new Date();
    const twentyTwoHoursAgo = new Date(now.getTime() - 22 * 60 * 60 * 1000);
    const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);
    const transactions = await client_1.prisma.transaction.findMany({
        where: {
            type: 'PURCHASE',
            createdAt: {
                gte: twentyThreeHoursAgo,
                lt: twentyTwoHoursAgo,
            },
        },
        include: {
            wallet: {
                include: { brand: true },
            },
        },
    });
    const sentSet = new Set();
    for (const tx of transactions) {
        const { wallet } = tx;
        const cacheKey = `${wallet.phoneNumber}-${wallet.brandId}`;
        if (sentSet.has(cacheKey))
            continue;
        const lowestMilestone = await client_1.prisma.rewardMilestone.findFirst({
            where: { brandId: wallet.brandId, isActive: true },
            orderBy: { coinsRequired: 'asc' },
        });
        if (!lowestMilestone)
            continue;
        if (wallet.currentCoins >= lowestMilestone.coinsRequired) {
            const expiryDateStr = wallet.expiryDate ? wallet.expiryDate.toISOString().split('T')[0] : 'N/A';
            try {
                await whatsapp_service_1.whatsappService.sendExpiryWarning(wallet.phoneNumber, wallet.brand.name, wallet.currentCoins, expiryDateStr, wallet.brandId);
                sentSet.add(cacheKey);
            }
            catch (error) {
                console.error(`Failed to send 22-hour reminder to ${wallet.phoneNumber}`, error);
            }
        }
    }
}
