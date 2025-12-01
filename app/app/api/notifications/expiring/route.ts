import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to fetch notifications');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const includeRead = searchParams.get('includeRead') === 'true';

    // Build where clause
    const whereClause: any = {
      userId: session.user.id,
    };

    if (!includeRead) {
      whereClause.isRead = false;
    }

    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        relatedItem: {
          select: {
            id: true,
            name: true,
            bestBeforeDate: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    logger.info(`Fetched ${notifications.length} notifications for user: ${session.user.id}`);

    return NextResponse.json(
      {
        notifications,
        unreadCount,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error fetching notifications: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
