import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Validation schema for food item
const addFoodItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category is too long'),
  bestBeforeDate: z.string().datetime('Invalid date format'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit is too long'),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to add food item');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = addFoodItemSchema.safeParse(body);

    if (!validationResult.success) {
      logger.warn(`Validation failed for add food item: ${JSON.stringify(validationResult.error.issues)}`);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { name, category, bestBeforeDate, quantity, unit } = validationResult.data;

    // Create food item in database
    const foodItem = await prisma.foodItem.create({
      data: {
        name,
        category,
        bestBeforeDate: new Date(bestBeforeDate),
        quantity,
        unit,
        userId: session.user.id,
      },
    });

    logger.info(`Food item created successfully: ${foodItem.id} by user: ${session.user.id}`);

    return NextResponse.json(
      {
        message: 'Food item added successfully',
        foodItem,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error adding food item: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
