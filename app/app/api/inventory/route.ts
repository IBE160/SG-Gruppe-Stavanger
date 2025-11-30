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
      logger.warn('Unauthorized attempt to fetch food items');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all food items for the authenticated user
    const foodItems = await prisma.foodItem.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.info(`Fetched ${foodItems.length} food items for user: ${session.user.id}`);

    return NextResponse.json(
      {
        foodItems,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error fetching food items: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
