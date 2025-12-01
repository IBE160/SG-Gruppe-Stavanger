import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';

/**
 * GET /api/shopping-list
 * Fetch all items in user's shopping list
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to fetch shopping list');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create shopping list for user
    let shoppingList = await prisma.shoppingList.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          orderBy: {
            addedAt: 'desc',
          },
        },
      },
    });

    // Create shopping list if it doesn't exist
    if (!shoppingList) {
      shoppingList = await prisma.shoppingList.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: true,
        },
      });
      logger.info(`Created shopping list for user: ${session.user.id}`);
    }

    logger.info(`Fetched ${shoppingList.items.length} shopping list items for user: ${session.user.id}`);

    return NextResponse.json(
      {
        items: shoppingList.items,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error fetching shopping list: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shopping-list
 * Add item to shopping list
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to add shopping list item');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, amount, unit, recipeId, recipeName } = body;

    // Validate required fields
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    if (amount === undefined || typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { error: 'Amount is required and must be a non-negative number' },
        { status: 400 }
      );
    }

    if (!unit || typeof unit !== 'string') {
      return NextResponse.json(
        { error: 'Unit is required and must be a string' },
        { status: 400 }
      );
    }

    // Get or create shopping list for user
    let shoppingList = await prisma.shoppingList.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!shoppingList) {
      shoppingList = await prisma.shoppingList.create({
        data: {
          userId: session.user.id,
        },
      });
      logger.info(`Created shopping list for user: ${session.user.id}`);
    }

    // Check if item already exists
    const existingItem = await prisma.shoppingListItem.findFirst({
      where: {
        shoppingListId: shoppingList.id,
        name: name,
        recipeId: recipeId || null,
      },
    });

    if (existingItem) {
      // Update quantity if item already exists
      const updatedItem = await prisma.shoppingListItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          amount: existingItem.amount + amount,
          addedAt: new Date(), // Update timestamp
        },
      });

      logger.info(`Updated shopping list item: ${updatedItem.id} for user: ${session.user.id}`);

      return NextResponse.json(
        {
          item: updatedItem,
          message: 'Item quantity updated',
        },
        { status: 200 }
      );
    }

    // Create new shopping list item
    const newItem = await prisma.shoppingListItem.create({
      data: {
        name,
        amount,
        unit,
        recipeId: recipeId || null,
        recipeName: recipeName || null,
        shoppingListId: shoppingList.id,
      },
    });

    logger.info(`Added shopping list item: ${newItem.id} for user: ${session.user.id}`);

    return NextResponse.json(
      {
        item: newItem,
        message: 'Item added to shopping list',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(`Error adding shopping list item: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shopping-list
 * Clear all items from shopping list
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to clear shopping list');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get shopping list
    const shoppingList = await prisma.shoppingList.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!shoppingList) {
      return NextResponse.json(
        { message: 'Shopping list is already empty' },
        { status: 200 }
      );
    }

    // Delete all items
    const result = await prisma.shoppingListItem.deleteMany({
      where: {
        shoppingListId: shoppingList.id,
      },
    });

    logger.info(`Cleared ${result.count} items from shopping list for user: ${session.user.id}`);

    return NextResponse.json(
      {
        message: `Cleared ${result.count} items from shopping list`,
        count: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error clearing shopping list: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
