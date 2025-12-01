import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';

/**
 * DELETE /api/shopping-list/[id]
 * Delete a specific item from shopping list
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to delete shopping list item');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get user's shopping list
    const shoppingList = await prisma.shoppingList.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!shoppingList) {
      logger.warn(`Shopping list not found for user: ${session.user.id}`);
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      );
    }

    // Check if item exists and belongs to user
    const item = await prisma.shoppingListItem.findUnique({
      where: {
        id: id,
      },
    });

    if (!item) {
      logger.warn(`Shopping list item not found: ${id}`);
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    if (item.shoppingListId !== shoppingList.id) {
      logger.warn(`Unauthorized attempt to delete item ${id} by user ${session.user.id}`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the item
    await prisma.shoppingListItem.delete({
      where: {
        id: id,
      },
    });

    logger.info(`Deleted shopping list item: ${id} for user: ${session.user.id}`);

    return NextResponse.json(
      {
        message: 'Item deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error deleting shopping list item: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/shopping-list/[id]
 * Update a shopping list item (e.g., mark as purchased)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to update shopping list item');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Parse request body
    const body = await request.json();
    const { purchased, amount, unit } = body;

    // Get user's shopping list
    const shoppingList = await prisma.shoppingList.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!shoppingList) {
      logger.warn(`Shopping list not found for user: ${session.user.id}`);
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      );
    }

    // Check if item exists and belongs to user
    const item = await prisma.shoppingListItem.findUnique({
      where: {
        id: id,
      },
    });

    if (!item) {
      logger.warn(`Shopping list item not found: ${id}`);
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    if (item.shoppingListId !== shoppingList.id) {
      logger.warn(`Unauthorized attempt to update item ${id} by user ${session.user.id}`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update the item
    const updatedItem = await prisma.shoppingListItem.update({
      where: {
        id: id,
      },
      data: {
        ...(purchased !== undefined && { purchased }),
        ...(amount !== undefined && { amount }),
        ...(unit !== undefined && { unit }),
      },
    });

    logger.info(`Updated shopping list item: ${id} for user: ${session.user.id}`);

    return NextResponse.json(
      {
        item: updatedItem,
        message: 'Item updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error updating shopping list item: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
