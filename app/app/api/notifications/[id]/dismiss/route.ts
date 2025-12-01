import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to dismiss notification');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: notificationId } = await params;

    // Find the notification
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    // Check if notification exists
    if (!notification) {
      logger.warn(`Notification not found: ${notificationId}`);
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (notification.userId !== session.user.id) {
      logger.warn(`User ${session.user.id} attempted to dismiss notification ${notificationId} owned by ${notification.userId}`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update notification as read
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    logger.info(`Notification dismissed: ${notificationId} by user: ${session.user.id}`);

    return NextResponse.json(
      {
        message: 'Notification dismissed successfully',
        notificationId,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error dismissing notification: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
