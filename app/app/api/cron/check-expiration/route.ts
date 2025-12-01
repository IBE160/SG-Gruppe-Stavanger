import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Verify Vercel Cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized cron job attempt');
      return NextResponse.json(
        { error: 'Invalid cron secret' },
        { status: 401 }
      );
    }

    logger.info('Starting expiration check cron job');

    // Calculate date range for items expiring in 2-3 days
    const now = new Date();
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(now.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);
    threeDaysFromNow.setHours(23, 59, 59, 999);

    // Find all food items expiring in 2-3 days
    const expiringItems = await prisma.foodItem.findMany({
      where: {
        bestBeforeDate: {
          gte: twoDaysFromNow,
          lte: threeDaysFromNow,
        },
      },
      include: {
        User: true,
      },
    });

    logger.info(`Found ${expiringItems.length} items expiring in 2-3 days`);

    let notificationsCreated = 0;
    const usersNotified = new Set<string>();

    // Create notifications for each expiring item
    for (const item of expiringItems) {
      // Check if a notification already exists for this item
      const existingNotification = await prisma.notification.findFirst({
        where: {
          relatedItemId: item.id,
          userId: item.userId,
          type: 'EXPIRATION_WARNING',
          isRead: false,
        },
      });

      // Skip if notification already exists
      if (existingNotification) {
        logger.debug(`Notification already exists for item: ${item.id}`);
        continue;
      }

      // Calculate days until expiration
      const daysUntilExpiration = Math.ceil(
        (item.bestBeforeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine priority based on days until expiration
      const priority = daysUntilExpiration <= 2 ? 'HIGH' : 'MEDIUM';

      // Create notification
      await prisma.notification.create({
        data: {
          type: 'EXPIRATION_WARNING',
          title: 'Food Item Expiring Soon',
          message: `Your ${item.name} expires in ${daysUntilExpiration} day${daysUntilExpiration > 1 ? 's' : ''}. Use it soon to avoid waste!`,
          priority,
          userId: item.userId,
          relatedItemId: item.id,
        },
      });

      notificationsCreated++;
      usersNotified.add(item.userId);

      logger.info(`Created notification for item: ${item.name} (ID: ${item.id})`);
    }

    logger.info(`Expiration check completed: ${notificationsCreated} notifications created for ${usersNotified.size} users`);

    return NextResponse.json(
      {
        message: 'Expiration check completed',
        notificationsCreated,
        usersNotified: usersNotified.size,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error in expiration check cron job: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
