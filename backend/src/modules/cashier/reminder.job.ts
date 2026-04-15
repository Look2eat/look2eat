import { prisma } from '../../prisma/client';
import { whatsappService } from '../../common/services/whatsapp.service';

export function startReminderJob() {
  const ONE_HOUR = 60 * 60 * 1000;

  setInterval(async () => {
    try {
      await processReminders();
    } catch (error) {
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

  const transactions = await prisma.transaction.findMany({
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

  const sentSet = new Set<string>();

  for (const tx of transactions) {
    const { wallet } = tx;
    const cacheKey = `${wallet.phoneNumber}-${wallet.brandId}`;

    if (sentSet.has(cacheKey)) continue;

    const lowestMilestone = await prisma.rewardMilestone.findFirst({
      where: { brandId: wallet.brandId, isActive: true },
      orderBy: { coinsRequired: 'asc' },
    });

    if (!lowestMilestone) continue; 

    if (wallet.currentCoins >= lowestMilestone.coinsRequired) {

      const expiryDateStr = wallet.expiryDate ? wallet.expiryDate.toISOString().split('T')[0] : 'N/A';

      try {
        await whatsappService.sendExpiryWarning(
          wallet.phoneNumber,
          wallet.brand.name,
          wallet.currentCoins,
          expiryDateStr,
          wallet.brandId
        );
        sentSet.add(cacheKey);
      } catch (error) {
        console.error(`Failed to send 22-hour reminder to ${wallet.phoneNumber}`, error);
      }
    }
  }
}
