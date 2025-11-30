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

    // Get sorting parameters from query string
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate sort parameters
    const validSortFields = ['name', 'category', 'bestBeforeDate', 'createdAt'];
    const validSortOrders = ['asc', 'desc'];

    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    // Fetch all food items for the authenticated user with sorting
    const foodItems = await prisma.foodItem.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        [sortField]: sortDirection,
      },
    });

    logger.info(`Fetched ${foodItems.length} food items for user: ${session.user.id} (sorted by ${sortField} ${sortDirection})`);

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
