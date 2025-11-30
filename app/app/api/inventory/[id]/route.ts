import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Validation schema for updating food item
// All fields are optional since user may update only specific fields
const updateFoodItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  category: z.string().min(1, 'Category is required').max(50, 'Category is too long').optional(),
  bestBeforeDate: z.string().datetime('Invalid date format').optional(),
  quantity: z.number().positive('Quantity must be positive').optional(),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit is too long').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to update food item');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if food item exists
    const existingItem = await prisma.foodItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      logger.warn(`Food item not found: ${id}`);
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }

    // Authorization check: verify the food item belongs to the authenticated user
    if (existingItem.userId !== session.user.id) {
      logger.warn(`User ${session.user.id} attempted to edit food item ${id} owned by ${existingItem.userId}`);
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateFoodItemSchema.safeParse(body);

    if (!validationResult.success) {
      logger.warn(`Validation failed for update food item: ${JSON.stringify(validationResult.error.issues)}`);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Convert bestBeforeDate string to Date object if provided
    const dataToUpdate: any = { ...updateData };
    if (dataToUpdate.bestBeforeDate) {
      dataToUpdate.bestBeforeDate = new Date(dataToUpdate.bestBeforeDate);
    }

    // Update food item in database
    const updatedItem = await prisma.foodItem.update({
      where: { id },
      data: dataToUpdate,
    });

    logger.info(`Food item updated successfully: ${id} by user: ${session.user.id}`);

    return NextResponse.json(
      {
        message: 'Food item updated successfully',
        foodItem: updatedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error updating food item: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
